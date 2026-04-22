import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from src.scanner import AIScanner
from src.config import settings
from src.database import SessionLocal
from src.models import ScanReport

logging.basicConfig(level= logging.INFO)

async def consume():
    # 1. Initialize the Scanner with the API KEY
    scanner= AIScanner(api_key= settings.GEMINI_API_KEY)
    consumer= AIOKafkaConsumer(
        "project_scans",
        bootstrap_servers= settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id= "scan_workers",
        value_deserializer= lambda m: json.loads(m.decode('utf-8')),
        max_poll_interval_ms= 300000,
        session_timeout_ms= 30000
    )

    await consumer.start()
    logging.info("AI Worker is LIVE and listening for tasks...")

    try:
        async for msg in consumer:
            task= msg.value
            project_id= task.get("project_id")
            repo_url= task.get("repo_url")
            logging.info(f"RECEIVED TASK FOR PROJECT {project_id}: {repo_url}")

            # 2. RUN THE AI SCAN WITH RETRIES
            max_retries = 3
            attempt = 0
            success = False
            
            while attempt < max_retries and not success:
                try:
                    attempt += 1
                    logging.info(f"SCAN ATTEMPT {attempt}/{max_retries} FOR PROJECT {project_id}...")
                    
                    report= await scanner.scan_repo(repo_url)

                    if "error" in report:
                        logging.error(f"SCAN FAILED: {report['error']}")
                        break # Don't retry if it's a code error
                    
                    # 3. SAVE TO DATABASE
                    async with SessionLocal() as db:
                        new_report= ScanReport(
                            project_id= project_id,
                            report_data= report["raw_report"]
                        )
                        db.add(new_report)
                        await db.commit()
                        logging.info(f"REPORT SAVED TO DB FOR PROJECT {project_id}!")
                        success = True
                
                except Exception as e:
                    if "429" in str(e):
                        wait_time = 60 * attempt # Wait longer each time
                        logging.warning(f"RATE LIMIT HIT (429). Attempt {attempt} failed. Waiting {wait_time}s...")
                        if attempt < max_retries:
                            await asyncio.sleep(wait_time)
                        else:
                            logging.error(f"MAX RETRIES REACHED for project {project_id}. Skipping.")
                    else:
                        logging.error(f"CRITICAL ERROR processing project {project_id}: {e}")
                        break # Don't retry other errors
            
            if not success:
                continue

    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume())