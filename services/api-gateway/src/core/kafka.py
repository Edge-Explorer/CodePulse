import json
from aiokafka import AIOKafkaProducer
import logging

producer= None

async def init_kafka():
    global producer
    producer= AIOKafkaProducer(
        bootstrap_servers= 'localhost:9092',
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