from pydantic import BaseModel
from typing import Optional, List

# ML Models
class PredictionRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

class PredictionResponse(BaseModel):
    status: str
    label: str
    confidence: float

class TrainResponse(BaseModel):
    success: bool
    message: str
    accuracy: Optional[float] = None
    training_samples: Optional[int] = None
    test_samples: Optional[int] = None

# Admin/Auth Models
class AdminLoginRequest(BaseModel):
    email: str
    password: str

class AdminLoginResponse(BaseModel):
    success: bool
    access_token: Optional[str] = None
    email: Optional[str] = None
    message: Optional[str] = None
    user: Optional[dict] = None

# Feedback Models
class FeedbackSubmitRequest(BaseModel):
    name: str
    email: str
    message: str

class FeedbackRow(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    message: str
    submitted_at: Optional[str] = None

class FeedbackListResponse(BaseModel):
    success: bool
    feedback: List[FeedbackRow]
