import re
import joblib
import nltk
import os
from pathlib import Path
from nltk.corpus import stopwords
import pandas as pd
from newspaper import Article
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.utils import resample
from ..core.config import settings

# Download required NLTK data
try:
    nltk.download("stopwords", quiet=True)
    nltk.download('punkt', quiet=True)
except:
    pass

stop_words = set(stopwords.words("english"))

class MLService:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.model_path = Path(settings.MODEL_DIR) / settings.MODEL_FILENAME
        self.vectorizer_path = Path(settings.MODEL_DIR) / settings.VECTORIZER_FILENAME
        self.load_models()

    def clean_text(self, text):
        """Clean and normalize text for model processing."""
        if not text:
            return ""
        text = str(text).lower()
        text = re.sub(r"http\S+|www\S+", "", text)
        text = re.sub(r"[^a-zA-Z]", " ", text)
        words = text.split()
        words = [w for w in words if w not in stop_words]
        return " ".join(words)

    def extract_text_from_url(self, url):
        """Extract main article text from a URL using newspaper3k."""
        try:
            # Add User-Agent to bypass scraping protections (e.g. Reuters)
            from newspaper import Config
            config = Config()
            config.browser_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            config.request_timeout = 10
            
            article = Article(url, config=config)
            article.download()
            article.parse()
            
            # Fallback for short extraction
            if not article.text or len(article.text) < 100:
                print(f"Warning: Extracted text for {url} is very short. This might be a login wall.")
                return article.text or ""
                
            return article.text
        except Exception as e:
            print(f"Error extracting text from URL {url}: {e}")
            return ""

    def load_models(self):
        """Load trained models from disk if they exist."""
        if self.model_path.exists() and self.vectorizer_path.exists():
            try:
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                print(f"[OK] Models loaded from {settings.MODEL_DIR}")
                return True
            except Exception as e:
                print(f"[ERROR] Error loading models: {e}")
                return False
        return False

    def save_models(self):
        """Save trained models to disk."""
        try:
            os.makedirs(settings.MODEL_DIR, exist_ok=True)
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.vectorizer, self.vectorizer_path)
            print(f"[OK] Models saved to {settings.MODEL_DIR}")
        except Exception as e:
            print(f"[ERROR] Error saving models: {e}")
            raise

    def predict(self, text: str):
        if self.model is None or self.vectorizer is None:
            return None
        
        cleaned = self.clean_text(text)
        if not cleaned or len(cleaned) < 20:
            return "TOO_SHORT"
        
        vec = self.vectorizer.transform([cleaned])
        proba = self.model.predict_proba(vec)[0]
        pred = self.model.predict(vec)[0]
        
        # Ensure mapping matches the probabilities
        # Proba usually orders classes alphabetically: ["FAKE", "REAL"]
        # which means index 0 is FAKE, index 1 is REAL
        fake_prob = float(proba[0])
        real_prob = float(proba[1])
        
        prediction = str(pred).upper()
        confidence = max(fake_prob, real_prob) * 100
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "fake_probability": fake_prob,
            "real_probability": real_prob
        }

    def train_from_df(self, df: pd.DataFrame):
        """Train model from a pre-processed dataframe with 'clean' and 'label' columns."""
        # Clean and normalize labels
        if df["label"].dtype == object:
            mapping = {"fake": 0, "real": 1, "true": 1, "0": 0, "1": 1}
            df["label"] = df["label"].astype(str).str.lower().map(mapping)
        
        df = df.dropna(subset=["label", "clean"])
        
        # Robust Auto-Detection of Labels (0/1 mapping)
        # We look for common keywords to decide if 0 is Real or Fake
        try:
            sample_0 = " ".join(df[df["label"].astype(str).isin(['0', '0.0'])]["clean"].head(50))
            sample_1 = " ".join(df[df["label"].astype(str).isin(['1', '1.0'])]["clean"].head(50))
            
            # Common "FAKE news" indicators for auto-detection
            fake_keywords = ['breaking', 'shocking', 'unbelievable', 'conspiracy', 'whistleblower', 'secret document']
            count_0 = sum(1 for k in fake_keywords if k in sample_0.lower())
            count_1 = sum(1 for k in fake_keywords if k in sample_1.lower())
            
            # If 1 has more indicators, then 1=FAKE, 0=REAL.
            # Otherwise, 0=FAKE, 1=REAL (Standard WELFake).
            is_flipped = count_0 < count_1
            mapping = {0: 'FAKE', 1: 'REAL'} if not is_flipped else {0: 'REAL', 1: 'FAKE'}
            print(f"[AI] Detected Mapping: {'0=FAKE, 1=REAL' if not is_flipped else '0=REAL, 1=FAKE'}")
            
            df["label_str"] = df["label"].astype(float).astype(int).map(mapping)
        except Exception as e:
            print(f"Fallback Mapping: {e}")
            df["label_str"] = df["label"].astype(str).str.upper().map({'0': 'FAKE', '1': 'REAL', '0.0': 'FAKE', '1.0': 'REAL'})

        df = df.dropna(subset=["label_str"])

        # Handle Class Imbalance
        print(f"Balancing dataset... Original: {len(df)} samples")
        df_fake = df[df["label_str"] == 'FAKE']
        df_real = df[df["label_str"] == 'REAL']
        
        if len(df_fake) == 0 or len(df_real) == 0:
            print(f"[ERROR] Missing a class! Fake: {len(df_fake)}, Real: {len(df_real)}")
            return {"accuracy": 0, "training_samples": 0, "test_samples": 0}

        # Target a balanced split
        target_per_class = min(max(len(df_fake), len(df_real)), 5000)

        df_fake_resampled = resample(df_fake, 
                                     replace=(len(df_fake) < target_per_class),
                                     n_samples=target_per_class, 
                                     random_state=42)
        
        df_real_resampled = resample(df_real, 
                                     replace=(len(df_real) < target_per_class),
                                     n_samples=target_per_class, 
                                     random_state=42)
        
        df_balanced = pd.concat([df_fake_resampled, df_real_resampled])
        df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)
        print(f"Balanced to: {len(df_balanced)} samples total ({target_per_class} per class)")

        # Prepare for training
        X = df_balanced["clean"]
        y = df_balanced["label_str"]

        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2)
        )
        
        X_vec = self.vectorizer.fit_transform(X)
        y_target = y
        
        # Split for evaluation
        X_train, X_test, y_train, y_test = train_test_split(
            X_vec, y_target, test_size=0.1, random_state=42, stratify=y_target
        )
        
        # Train model
        self.model = MultinomialNB()
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Save models to disk
        self.save_models()
        
        return {
            "accuracy": accuracy,
            "training_samples": X_train.shape[0],
            "test_samples": X_test.shape[0]
        }

ml_service = MLService()
