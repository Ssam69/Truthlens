from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from ...models.schemas import PredictionRequest, PredictionResponse, TrainResponse
from ...services.ml_service import ml_service
from ...services.supabase_client import supabase_service
import pandas as pd
import io

router = APIRouter(prefix="/ml", tags=["ML Operations"])

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Make a prediction on provided text or URL."""
    try:
        text_to_analyze = None
        
        if request.text:
            text_to_analyze = request.text
        elif request.url:
            print(f"Extracting text from URL: {request.url}")
            text_to_analyze = ml_service.extract_text_from_url(request.url)
            if not text_to_analyze:
                return JSONResponse(status_code=400, content={"error": "Scraping failed", "suggestion": "Could not extract text from provided URL. Try manual text input."})
        else:
            return JSONResponse(status_code=400, content={"error": "Invalid request", "suggestion": "Please provide either 'text' or 'url'."})
        
        result = ml_service.predict(text_to_analyze)
        if result == "TOO_SHORT":
            return JSONResponse(status_code=400, content={"error": "Text too short", "suggestion": "Please provide a longer text for analysis."})
        if result is None:
            return JSONResponse(status_code=500, content={"error": "Model not trained", "suggestion": "Please contact system administrator."})

        # Save to history
        await supabase_service.save_prediction(
            input_text=text_to_analyze,
            prediction=result['prediction'],
            confidence=result['confidence']
        )
        
        return PredictionResponse(
            status="success",
            label="Real" if result['prediction'] == "REAL" else "Fake",
            confidence=result['confidence']
        )
        
    except Exception as e:
        print(f"[ERROR] Prediction error: {e}")
        return JSONResponse(status_code=500, content={"error": "Analysis processing failed", "suggestion": str(e)})

# (Re-training endpoint if needed, but the user asked for a separate script for model scaling)
@router.post("/train", response_model=TrainResponse)
async def train_endpoint(files: list[UploadFile] = File(...)):
    """Training endpoint (handles CSV uploads)."""
    # Just for completeness, normally we'd move this into a service
    try:
        frames = []
        for file in files:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents))
            # Basic validation (simplified)
            if 'text' in df.columns and 'label' in df.columns:
                 df['clean'] = df['text'].apply(ml_service.clean_text)
                 frames.append(df)
            else:
                 print(f"Skipping {file.filename}: missing columns")
        
        if not frames:
            raise HTTPException(400, "No valid CSV data provided.")
        
        combined_df = pd.concat(frames)
        stats = ml_service.train_from_df(combined_df)
        
        return TrainResponse(
            success=True,
            message=f"Model trained successfully. Accuracy: {stats['accuracy']:.2%}",
            accuracy=stats['accuracy'],
            training_samples=stats['training_samples'],
            test_samples=stats['test_samples']
        )
    except Exception as e:
        return TrainResponse(success=False, message=str(e))
