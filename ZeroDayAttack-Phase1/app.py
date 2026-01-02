import sys
import os
from flask import Flask, render_template, request, jsonify

# -------------------------------
# FIX PYTHON PATH (VERY IMPORTANT)
# -------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

# now Python can see ml/
from detect import detect

# -------------------------------
# FLASK APP SETUP
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    static_folder=BASE_DIR,
    static_url_path="",
    template_folder=BASE_DIR
)

# -------------------------------
# HOME PAGE
# -------------------------------
@app.route("/")
def home():
    with open(os.path.join(BASE_DIR, "index.html"), "r") as f:
        return f.read()

# -------------------------------
# DETECTION API
# -------------------------------
@app.route("/detect")
def run_detection():
    try:
        threshold = float(request.args.get("threshold", 0.6))

        results = detect(threshold)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# START SERVER
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
