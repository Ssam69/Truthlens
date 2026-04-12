from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ...models.schemas import FeedbackSubmitRequest, FeedbackListResponse
from ...services.supabase_client import supabase_service

router = APIRouter(prefix="/feedback", tags=["Feedback Operations"])

@router.post("/", response_model=dict)
async def submit_feedback(request: FeedbackSubmitRequest):
    """Public endpoint to submit feedback."""
    try:
        saved = await supabase_service.save_feedback(
            name=request.name,
            email=request.email,
            message=request.message
        )
        if not saved:
            raise HTTPException(400, "Failed to save feedback.")
        
        return {"success": True, "message": "Feedback submitted successfully."}
    except Exception as e:
        print(f"Error submitting feedback: {e}")
        raise HTTPException(500, "An error occurred while submitting feedback.")

@router.get("/all", response_model=FeedbackListResponse)
async def get_all_feedback(authorization: Optional[str] = Header(None)):
    """Admin-only endpoint to get all feedback entries."""
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
    
    feedback_entries = await supabase_service.get_all_feedback()
    return FeedbackListResponse(
        success=True,
        feedback=feedback_entries
    )
