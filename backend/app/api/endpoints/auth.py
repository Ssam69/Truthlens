from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ...models.schemas import AdminLoginRequest, AdminLoginResponse
from ...services.supabase_client import supabase_service
from ...core.config import settings

router = APIRouter(prefix="/admin", tags=["Admin Auth"])

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(request: AdminLoginRequest):
    """
    Authenticate admin with email and password.
    """
    try:
        session = await supabase_service.sign_in_with_password(request.email, request.password)
        if not session:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        
        # Verify admin status
        is_admin = await supabase_service.is_admin(session['user']['id'])
        if not is_admin:
            raise HTTPException(status_code=403, detail="Admin access required.")
        
        return AdminLoginResponse(
            success=True,
            access_token=session['access_token'],
            email=session['user']['email'],
            user={
                "id": session['user']['id'],
                "email": session['user']['email'],
                "name": session['user'].get('user_metadata', {}).get('name', session['user']['email'])
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during authentication.")

@router.get("/verify-token", response_model=AdminLoginResponse)
async def verify_token(authorization: Optional[str] = Header(None)):
    """Verify admin token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token required.")
    
    token = authorization.split(" ")[1]
    user_data = await supabase_service.verify_token(token)
    
    if not user_data:
        raise HTTPException(401, "Invalid token.")
    
    # Check if this user is an admin
    is_admin = await supabase_service.is_admin(user_data['id'])
    if not is_admin:
        raise HTTPException(403, "Not an admin.")
    
    return AdminLoginResponse(
        success=True,
        email=user_data['email']
    )
