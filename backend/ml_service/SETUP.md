# ML Service Setup Guide

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend/ml_service
pip install -r requirements.txt
```

Or use a virtual environment:

```bash
cd backend/ml_service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Verify Model Files

Ensure these files exist in the project root `model/` folder:

- `model/ayur_xgb_model.pkl`
- `model/prakriti_model.pkl`
- `model/AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx`

### 3. Test Model Loading

```bash
cd backend/ml_service
python test_models.py
```

### 4. Start the ML Service

```bash
cd backend/ml_service
python main.py
```

Or use the startup script:

```bash
cd backend/ml_service
./start.sh
```

The service will start on `http://localhost:8000`

### 5. Configure Node.js Backend

Add to your `.env` file:

```env
ML_SERVICE_URL=http://localhost:8000
```

### 6. Test the Integration

```bash
# Test health endpoint
curl http://localhost:8000/api/model/health

# Test via Node.js backend
curl http://localhost:3000/api/model/health
```

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │  Node.js API │ ──────> │ Python ML   │
│   (React)   │         │   (Express)  │         │  (FastAPI)  │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │   Models    │
                                                  │  (.pkl)     │
                                                  └─────────────┘
```

## Model Loading Process

1. **Startup**: Models are loaded when the Python service starts
2. **Pipeline Check**: If model contains sklearn pipeline, use directly
3. **Encoder Building**: If not, build encoders from dataset
4. **Persistence**: Save encoders for future use

## Input Validation

- **Strict Schema**: Only whitelisted keys accepted
- **Required Fields**: Must include `gender`, `age`, `height_cm`, `weight_kg`, `daily_calories`, `diet_type`, `prakriti`
- **Extra Fields**: Automatically rejected (HTTP 400)
- **Contradictions**: Detected and rejected

## Clinical Safety

The service automatically:
- Checks for diabetes, celiac, CKD, reflux conditions
- Adds warnings to responses
- Sanitizes diet plans based on conditions
- Filters unsafe ingredients

## Troubleshooting

### Models won't load

```bash
# Test model file directly
python -c "import joblib; joblib.load('../model/ayur_xgb_model.pkl'); print('OK')"
```

### Encoders not found

The service will automatically build encoders from the dataset on first run.

### Port already in use

Change the port in `main.py`:

```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Import errors

Make sure you're running from the `backend/ml_service` directory or have the package installed.

## Production Deployment

1. Use a process manager (PM2, systemd, etc.)
2. Set up reverse proxy (nginx)
3. Configure environment variables
4. Enable HTTPS
5. Set up monitoring and logging
6. Configure rate limiting
