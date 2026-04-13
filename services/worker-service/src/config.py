import os
from dotenv import load_dotenv

env_path= os.path.join(os.path.dirname(__file__), "../../../.env")
load_dotenv(env_path)

class Settings:
    GEMINI_API_KEY= os.getenv("GEMINI_API_KEY")
    DATABASE_URL= os.getenv("DATABASE_URL")
    KAFKA_BOOTSTRAP_SERVERS= os.getenv("KAFKA_BOOTSTRAP_SERVERS", "127.0.0.1:9092")

settings= Settings()