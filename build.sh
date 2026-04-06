#!/bin/bash
set -e

# Build the Node/React app
cd frontend
npm install
npm run build
cd ..

# Ensure we have the latest Python dependencies (for local verify)
pip install -r requirements.txt
