import os
from supabase import create_client
from dotenv import load_dotenv

# Load from backend/.env if it exists, or provided info
# Wait, I'll use the ones I saw in frontend/.env and config
URL = os.getenv("SUPABASE_URL", "")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Wait, I'll grep it from backend/.env
