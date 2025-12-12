#!/bin/bash
# Startup script for ML service

echo "Starting Ayutra ML Service..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if model files exist
if [ ! -f "../model/ayur_xgb_model.pkl" ]; then
    echo "Warning: ayur_xgb_model.pkl not found"
fi

if [ ! -f "../model/prakriti_model.pkl" ]; then
    echo "Warning: prakriti_model.pkl not found"
fi

if [ ! -f "../model/AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx" ]; then
    echo "Warning: Dataset file not found"
fi

# Start the service
echo "Starting FastAPI service..."
python main.py
