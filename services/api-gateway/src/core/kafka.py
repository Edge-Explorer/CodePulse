import json
from aiokafka import AIOKafkaProducer
import logging
from src.core.config import settings

producer= None

async def init_kafka():
    global producer
    
    producer_config = {
        "bootstrap_servers": settings.KAFKA_BOOTSTRAP_SERVERS,
        "value_serializer": lambda v: json.dumps(v).encode('utf-8')
    }

    # Add Cloud Authentication if credentials exist
    if settings.KAFKA_SASL_USERNAME:
        producer_config.update({
            "security_protocol": "SASL_SSL",
            "sasl_mechanism": "SCRAM-SHA-256",
            "sasl_plain_username": settings.KAFKA_SASL_USERNAME,
            "sasl_plain_password": settings.KAFKA_SASL_PASSWORD
        })

    producer = AIOKafkaProducer(**producer_config)
    await producer.start()
    logging.info("Kafka Producer Started (Authenticated)!")

async def stop_kafka():
    if producer:
        await producer.stop()

async def send_task(topic: str, data: dict):
    if producer:
        print(f"DEBUG: Attempting to send message to {topic}...")
        await producer.send_and_wait(topic, data)
        print(f"DEBUG: Message successfully sent to {topic}!")
        logging.info(f"Message sent to {topic}: {data}")
    else:
        print("DEBUG: ERROR - Kafka Producer is NONE! Task was NOT sent.")