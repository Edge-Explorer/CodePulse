import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer

logging.basicConfig(level= logging.INFO)

async def consume():
    consumer= AIOKafkaConsumer(
        "project_scans",
        bootstrap_servers= '127.0.0.1:9092',
        group_id= "scan_workers",
        value_deserializer= lambda m: json.loads(m.decode('utf-8'))
    )

    await consumer.start()
    logging.info("AI Worker is listerning for task...")

    try:
        async for msg in consumer:
            task= msg.value
            project_id= task.get("project_id")
            repo= task.get("repo_url")
            logging.info(f"RECEIVED TASK FOR PROJECT {project_id}: {repo}")

            logging.info(f"Scanning code in {repo}...")
            await asyncio.sleep(5)
            logging.info(f"SCAN COMPLETE for Project {project_id}!")

    finally:
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume())