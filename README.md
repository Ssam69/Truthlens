# TruthLens: AI-Powered Fake News Detector

TruthLens is a production-ready application that identifies fake news by analyzing text content or scraping articles directly from URLs. It uses a machine learning model integrated with Supabase for user authentication and history management.

## Project Structure

```bash
├── backend/                # Unified FastAPI Backend
│   ├── app/
│   │   ├── api/            # API Endpoints (ML, Auth, Feedback)
│   │   ├── core/           # Configuration and Settings
│   │   ├── models/         # Pydantic Schema Definitions
│   │   ├── services/       # ML Logic & Supabase Interactions
│   │   └── main.py         # Application Entry Point
│   ├── ml_models/          # Saved model.pkl and vectorizer.pkl
│   ├── train_model.py      # Scalable model training script
│   ├── Dockerfile          # Production deployment script
│   └── requirements.txt    # Python dependencies
├── frontend/               # React (Vite/Next.js) Application
└── .env                    # Environment variables (required)
```

## Features

- **Text Analysis**: Direct text input for deep linguistic analysis.
- **URL Scraping**: Pass any news link to have its content automatically extracted and analyzed.
- **Unified Backend**: All operations (ML, Auth, Feedback) consolidated into a single FastAPI service.
- **Secure Authentication**: Traditional Email/Password Sign-In with OTP verification during Sign-Up.
- **Admin Dashboard**: Specialized access for managing feedback and viewing global statistics.

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- Supabase Account (URL and Keys)

### 2. Backend Configuration
Navigate to the `backend` folder and follow these steps:

1. Create a `.env` file with the following variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_EMAIL=samalfrin@gmail.com
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python -m app.main
   ```

### 3. Frontend Configuration
Navigate to the `frontend` folder:

1. Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
2. Install & Run:
   ```bash
   npm install
   npm run dev
   ```

## Model Retraining

To retrain the model with more data (5,000–7,000 articles) and handle class imbalance:
```bash
python backend/train_model.py --data path/to/dataset.csv --size 7000
```
This will generate fresh `model.pkl` and `vectorizer.pkl` files in `backend/ml_models/`.

## Deployment

### Docker (Recommended)
Build and run the unified backend container:
```bash
docker build -t truthlens-backend backend/
docker run -p 5000:5000 --env-file .env truthlens-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ml/predict` | Analyze text or URL for fake news |
| POST | `/api/v1/ml/train` | Upload CSVs to retrain model |
| POST | `/api/v1/admin/login` | Authenticate admin user |
| POST | `/api/v1/feedback/` | Submit user feedback |
| GET | `/api/v1/feedback/all` | [Admin Only] View all feedback |
