import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "TruthLens Fake News Detector"
    VERSION: str = "1.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase config
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Admin config
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")
    
    # Email config
    BREVO_API_KEY: str = os.getenv("BREVO_API_KEY", "")
    
    # Model config
    MODEL_DIR: str = os.getenv("MODEL_DIR", "ml_models")
    MODEL_FILENAME: str = "model.pkl"
    VECTORIZER_FILENAME: str = "vectorizer.pkl"
    
settings = Settings()
