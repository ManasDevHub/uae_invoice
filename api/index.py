from app.main import app
import os

# This entry point is specifically for Vercel's Python runtime.
# It imports the existing FastAPI app from your modular structure.
# Vercel's serverless functions will then serve the API and the static assets.

# Ensure the STATIC_DIR is accessible from the bridge
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR, exist_ok=True)
