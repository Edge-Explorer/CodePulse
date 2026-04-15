import json
from aiokafka import AIOKafkaProducer
import logging
from src.core.config import settings

producer= None

async def init_kafka():
    global producer
    producer= AIOKafkaProducer(
        bootstrap_servers= settings.KAFKA_BOOTSTRAP_SERVERS,
        value_serializer= lambda v: json.dumps(v).encode('utf-8')
    )
    await producer.start()
    logging.info("Kafka Producer Started!")

async def stop_kafka():
    if producer:
        await producer.stop()

async def send_task(topic: str, data: dict):
    if producer:
        await producer.send_and_wait(topic, data)
        logging.info(f"Message sent to {topic}: {data}")