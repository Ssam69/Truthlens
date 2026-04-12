import sys
import os

# Set PYTHONPATH to include the backend directory so that absolute imports work.
sys.path.insert(0, os.path.abspath('.'))

from app.main import app
from fastapi.testclient import TestClient

def test_predict():
    client = TestClient(app)
    
    print("Testing ML API stability...")
    
    # 1. Invalid URL
    res1 = client.post("/api/v1/ml/predict", json={"url": "not a website"})
    print("Test 1 (Invalid URL):", res1.status_code, res1.json())
    
    # 2. Short Input
    res2 = client.post("/api/v1/ml/predict", json={"text": "Hi"})
    print("Test 2 (Short Text):", res2.status_code, res2.json())
    
    # 3. Valid Text
    res3 = client.post("/api/v1/ml/predict", json={"text": "The quick brown fox jumps over the lazy dog repeatedly to form a sentence that is sufficiently long enough for the ML model to analyze it properly without throwing the TOO_SHORT exception."})
    print("Test 3 (Valid Text):", res3.status_code, res3.json())

if __name__ == "__main__":
    test_predict()
