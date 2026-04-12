import asyncio
from app.services.supabase_client import supabase_service
from app.core.config import settings

async def test_admin_login():
    print(f"Testing login for admin@truthlens.com on {settings.SUPABASE_URL}")
    session = await supabase_service.sign_in_with_password("admin@truthlens.com", "admin12348")
    if session:
        print("Login Success!")
        is_admin = await supabase_service.is_admin(session['user']['id'])
        print(f"Is Admin: {is_admin}")
    else:
        print("Login Failed.")

if __name__ == "__main__":
    asyncio.run(test_admin_login())
