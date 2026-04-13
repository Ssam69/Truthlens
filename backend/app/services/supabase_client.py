import os
from supabase import create_client, Client
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta, timezone
from ..core.config import settings

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.anon_key = settings.SUPABASE_ANON_KEY
        self.service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        
        if not self.url or not self.anon_key:
            print("[WARN] SUPABASE_URL or SUPABASE_ANON_KEY not set!")
        
        # Public client for general operations (login, verification)
        self.client: Client = create_client(self.url, self.anon_key) if self.url and self.anon_key else None
        
        # Admin client for database operations (service role key)
        self.service_client: Client = create_client(self.url, self.service_role_key) if self.url and self.service_role_key else None

    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify access token with Supabase."""
        if not self.client:
            return None
        try:
            response = self.client.auth.get_user(token)
            if response and response.user:
                return {
                    'id': response.user.id,
                    'email': response.user.email,
                    'user_metadata': response.user.user_metadata or {}
                }
            return None
        except Exception as e:
            print(f"Token verification error: {e}")
            return None

    async def sign_in_with_password(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Sign in with email and password."""
        if not self.client:
            return None
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            if response and response.session:
                return {
                    'access_token': response.session.access_token,
                    'refresh_token': response.session.refresh_token,
                    'user': {
                        'id': response.user.id,
                        'email': response.user.email
                    }
                }
            return None
        except Exception as e:
            print(f"Sign in error: {e}")
            return None

    async def save_feedback(self, name: str, email: str, message: str) -> Optional[Dict[str, Any]]:
        """Save feedback to database."""
        if not self.service_client:
            return None
        try:
            response = self.service_client.table("feedback").insert({
                "name": name,
                "email": email,
                "message": message
            }).execute()
            if response and response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Save feedback error: {e}")
            return None

    async def get_all_feedback(self) -> Optional[list]:
        """Retrieve all feedback entries."""
        if not self.service_client:
            return None
        try:
            response = self.service_client.table("feedback").select("*").order("submitted_at", desc=True).execute()
            return response.data if response and response.data else []
        except Exception as e:
            print(f"Get feedback error: {e}")
            return None

    async def save_prediction(self, input_text: str, prediction: str, confidence: float):
        """Save prediction history."""
        if not self.service_client:
            return
        try:
            self.service_client.table("news_history").insert({
                "input_text": input_text[:500],
                "prediction": prediction,
                "confidence": confidence
            }).execute()
        except Exception as e:
            print(f"Error saving prediction history: {e}")

    async def is_admin(self, user_id: str) -> bool:
        """Check if a user is an admin."""
        client_to_use = self.service_client if self.service_client else self.client
        if not client_to_use:
            return False
            
        try:
            res = client_to_use.table("profiles").select("is_admin").eq("id", user_id).execute()
            if res.data and res.data[0].get("is_admin"):
                return True
            
            # Fallback for checking email against ADMIN_EMAIL
            if self.service_client:
                try:
                    res_user = self.service_client.auth.admin.get_user_by_id(user_id)
                    if res_user and res_user.user and res_user.user.email == settings.ADMIN_EMAIL:
                        return True
                except:
                    pass
                    
            return False
        except Exception as e:
            print(f"Admin check error: {e}")
            return False

    async def store_otp(self, email: str, otp: str, metadata: Dict[str, Any]):
        """Store OTP in the database."""
        if not self.service_client:
            return False
        try:
            expires_at = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
            self.service_client.table("otp_verifications").upsert({
                "email": email,
                "otp_code": otp,
                "expires_at": expires_at,
                "metadata": metadata
            }).execute()
            return True
        except Exception as e:
            print(f"Store OTP error: {e}")
            return False

    async def verify_and_consume_otp(self, email: str, otp: str) -> Optional[Dict[str, Any]]:
        """Verify OTP and return metadata if valid, then delete it."""
        if not self.service_client:
            return None
        try:
            res = self.service_client.table("otp_verifications").select("*").eq("email", email).execute()
            if not res.data:
                return None
            
            data = res.data[0]
            if data['otp_code'] != otp:
                return None
            
            expires_at = datetime.fromisoformat(data['expires_at'].replace('Z', '+00:00'))
            if expires_at < datetime.now(timezone.utc):
                # Delete expired OTP
                self.service_client.table("otp_verifications").delete().eq("email", email).execute()
                return None
            
            # Valid OTP, delete it and return metadata
            self.service_client.table("otp_verifications").delete().eq("email", email).execute()
            return data['metadata']
        except Exception as e:
            print(f"Verify OTP error: {e}")
            return None

    async def register_user(self, email: str, password: str, name: str) -> Optional[Dict[str, Any]]:
        """Create user in Supabase Auth and Profile."""
        if not self.service_client:
            return None
        try:
            # Create user in Auth
            auth_res = self.service_client.auth.admin.create_user({
                "email": email,
                "password": password,
                "user_metadata": {"name": name},
                "email_confirm": True
            })
            
            if auth_res and auth_res.user:
                user_id = auth_res.user.id
                # Create profile
                self.service_client.table("profiles").upsert({
                    "id": user_id,
                    "email": email,
                    "full_name": name,
                    "is_admin": False
                }).execute()
                
                # Sign in to get session
                return await self.sign_in_with_password(email, password)
            return None
        except Exception as e:
            print(f"Register user error: {e}")
            return None

supabase_service = SupabaseService()
