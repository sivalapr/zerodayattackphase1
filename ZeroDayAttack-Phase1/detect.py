import os
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(BASE_DIR, "model", "autoencoder.keras")
DATA_PATH = os.path.join(BASE_DIR, "data", "NSL-KDD", "KDDTest+.txt")

# Generate synthetic anomaly scores for demo purposes
# In production, this would load the actual model and data
np.random.seed(42)
mse = np.concatenate([
    np.random.normal(0.1, 0.05, 80),  # Normal samples
    np.random.normal(0.8, 0.1, 20)    # Anomalous samples
])

def detect(threshold):
    results = []
    for i, score in enumerate(mse[:100]):  # LIMIT to avoid RAM crash
        results.append({
            "index": int(i),
            "score": float(score),
            "status": "Anomaly" if score > threshold else "Normal"
        })
    return results
