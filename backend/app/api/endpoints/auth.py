import random
import string
from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ...models.schemas import (
    AdminLoginRequest, AdminLoginResponse, 
    SignupRequest, SignupResponse, 
    VerifyOTPRequest, VerifyOTPResponse
)
from ...services.supabase_client import supabase_service
from ...services.email_service import email_service
from ...core.config import settings

router = APIRouter(tags=["Authentication"])

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    """
    Authenticate user with email and password.
    Note: Using AdminLoginResponse as it has the fields we need.
    """
    try:
        session = await supabase_service.sign_in_with_password(request.email, request.password)
        if not session:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        # Check if user is admin
        is_admin = await supabase_service.is_admin(session['user']['id'])
        
        return AdminLoginResponse(
            success=True,
            access_token=session['access_token'],
            email=session['user']['email'],
            user={
                "id": session['user']['id'],
                "email": session['user']['email'],
                "name": session['user'].get('user_metadata', {}).get('name', session['user']['email']),
                "is_admin": is_admin
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during authentication.")

@router.post("/auth/signup/request", response_model=SignupResponse)
async def signup_request(request: SignupRequest):
    """
    Step 1: Request signup, generate OTP, and send email.
    """
    otp = generate_otp()
    metadata = {
        "name": request.name,
        "password": request.password
    }
    
    # Store OTP in DB
    success = await supabase_service.store_otp(request.email, otp, metadata)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to store verification code.")
    
    # Send email
    sent = await email_service.send_otp_email(request.email, otp)
    if not sent:
        # Fallback for dev: print it if sending fails
        print(f"FAILED TO SEND OTP TO {request.email}. CODE: {otp}")
        return SignupResponse(success=True, message="Verification code generated but email failed to send. Please contact support.")
    
    return SignupResponse(success=True, message="Verification code sent to your email.")

@router.post("/auth/signup/verify", response_model=VerifyOTPResponse)
async def signup_verify(request: VerifyOTPRequest):
    """
    Step 2: Verify OTP and create user.
    """
    metadata = await supabase_service.verify_and_consume_otp(request.email, request.otp)
    if not metadata:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")
    
    # Create user
    session = await supabase_service.register_user(
        email=request.email,
        password=metadata['password'],
        name=metadata['name']
    )
    
    if not session:
        raise HTTPException(status_code=500, detail="Perfectly verified, but failed to create user account.")
    
    return VerifyOTPResponse(
        success=True,
        message="Account created successfully!",
        access_token=session['access_token'],
        user={
            "id": session['user']['id'],
            "email": session['user']['email'],
            "name": metadata['name']
        }
    )

@router.post("/auth/signup/resend", response_model=SignupResponse)
async def signup_resend(email: str):
    """
    Resend verification code for an existing pending signup.
    """
    # Check if we have an existing record for this email
    try:
        res = supabase_service.service_client.table("pending_otps").select("metadata").eq("email", email).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="No pending signup found for this email.")
        
        metadata = res.data[0]['metadata']
        otp = generate_otp()
        
        # Update OTP and expiry
        await supabase_service.store_otp(email, otp, metadata)
        
        # Send email
        sent = await email_service.send_otp_email(email, otp)
        if not sent:
            print(f"FAILED TO RESEND OTP TO {email}. CODE: {otp}")
            return SignupResponse(success=True, message="Verification code generated but email failed to send.")
        
        return SignupResponse(success=True, message="Verification code resent to your email.")
    except Exception as e:
        print(f"Resend error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while resending the code.")

@router.get("/admin/verify-token", response_model=AdminLoginResponse)
async def verify_token(authorization: Optional[str] = Header(None)):
    """Verify admin token (shared with general auth for now)."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required.")
    
    token = authorization.split(" ")[1]
    user_data = await supabase_service.verify_token(token)
    
    if not user_data:
        raise HTTPException(401, "Invalid token.")
    
    # Check if this user is an admin
    is_admin = await supabase_service.is_admin(user_data['id'])
    
    return AdminLoginResponse(
        success=True,
        email=user_data['email'],
        user={
            "id": user_data['id'],
            "email": user_data['email'],
            "is_admin": is_admin
        }
    )
