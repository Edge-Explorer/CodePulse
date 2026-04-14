import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
from src.scanner import AIScanner
from src.config import settings

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

            # 2. RUN THE REAL AI SCAN!
            report= await scanner.scan_repo(repo_url)

            if "error" in report:
                logging.error(f"SCAN FAILED: {report['error']}")
            else:
                logging.info(f"SCAN COMPLETE for Project {project_id}!")
                print("\n--- AI REPORT ---")
                print(report["raw_report"])
                print("-----------------\n")

    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume())