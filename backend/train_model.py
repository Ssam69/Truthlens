import pandas as pd
import numpy as np
import re
import nltk
import os
import joblib
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.utils import resample

# Download required NLTK data
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

def clean_text(text):
    """Clean and normalize text for model processing."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)

def train_model(data_path, output_dir="ml_models", target_size=7000):
    """
    Train a fake news detection model with a balanced dataset.
    
    Args:
        data_path: Path to the CSV dataset. Assumes columns 'text' and 'label'.
        output_dir: Directory to save the models.
        target_size: Desired total dataset size.
    """
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # Handle column naming variability
    text_col = next((c for c in ['text', 'content', 'article', 'news', 'title'] if c in df.columns), None)
    label_col = next((c for c in ['label', 'class', 'target', 'type'] if c in df.columns), None)
    
    if not text_col or not label_col:
        raise ValueError(f"Dataset must contain content and label columns. Found: {df.columns.tolist()}")
    
    df = df.rename(columns={text_col: 'text', label_col: 'label'})
    
    # Pre-processing
    print("Cleaning text data...")
    df = df[['text', 'label']].dropna()
    df['clean'] = df['text'].apply(clean_text)
    df = df[df['clean'].str.len() > 30]
    
    # Ensure label is numeric
    if df['label'].dtype == object:
        # Map common label names
        mapping = {'fake': 0, 'real': 1, 'true': 1, '0': 0, '1': 1}
        df['label'] = df['label'].astype(str).str.lower().map(mapping)
    
    df = df.dropna(subset=['label'])
    df['label'] = df['label'].astype(int)
    
    # Handle Class Imbalance
    print("\nHandling class imbalance...")
    df_fake = df[df['label'] == 0]
    df_real = df[df['label'] == 1]
    
    print(f"Original counts - Fake: {len(df_fake)}, Real: {len(df_real)}")
    
    # Upsample/Downsample to balance
    # If we want a target_size of 7000, we want 3500 each.
    per_class_size = target_size // 2
    
    df_fake_resampled = resample(df_fake, 
                                 replace=(len(df_fake) < per_class_size),
                                 n_samples=per_class_size, 
                                 random_state=42)
    
    df_real_resampled = resample(df_real, 
                                 replace=(len(df_real) < per_class_size),
                                 n_samples=per_class_size, 
                                 random_state=42)
    
    df_balanced = pd.concat([df_fake_resampled, df_real_resampled])
    df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"Balanced samples: {len(df_balanced)} (Fake: {per_class_size}, Real: {per_class_size})")
    
    # Feature Extraction
    print("\nExtracting features...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(df_balanced['clean'])
    y = df_balanced['label']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Model Training
    print("Training Multinomial NB model...")
    model = MultinomialNB()
    model.fit(X_train, y_train)
    
    # Evaluation
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nTraining Complete. Accuracy: {acc:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Export
    os.makedirs(output_dir, exist_ok=True)
    joblib.dump(model, os.path.join(output_dir, "model.pkl"))
    joblib.dump(vectorizer, os.path.join(output_dir, "vectorizer.pkl"))
    print(f"\n[OK] Models saved to {output_dir}")

if __name__ == "__main__":
    # Example usage (user should replace with their actual dataset)
    # train_model("data/news_dataset_large.csv")
    print("Model scaling/training script initialized.")
    import argparse
    parser = argparse.ArgumentParser(description="Retrain TruthLens Model")
    parser.add_argument("--data", type=str, required=True, help="Path to CSV dataset")
    parser.add_argument("--size", type=int, default=7000, help="Target total samples")
    args = parser.parse_args()
    
    try:
        train_model(args.data, target_size=args.size)
    except Exception as e:
        print(f"Error: {e}")
