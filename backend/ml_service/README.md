# ML Service - Model Inference API

This service provides secure ML model inference endpoints for Ayutra.

## Setup

1. Install dependencies:
```bash
cd backend/ml_service
pip install -r requirements.txt
```

2. Ensure model files are in the correct location:
- `model/ayur_xgb_model.pkl`
- `model/prakriti_model.pkl`
- `model/AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx`

3. Run the service:
```bash
python main.py
# Or with uvicorn:
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Endpoints

### Health Check
```
GET /api/model/health
```

### Prediction
```
POST /api/model/predict
Content-Type: application/json

{
  "gender": "male",
  "age": 35,
  "height_cm": 175,
  "weight_kg": 75,
  "daily_calories": 2000,
  "diet_type": "vegetarian",
  "prakriti": "Vata-Pitta"
}
```

### Diet Plan Generation
```
POST /api/model/dietplan
Content-Type: application/json

(Same input as /predict)
```

## Validation

- Only whitelisted keys are accepted (see `config.py`)
- Extra fields are rejected (HTTP 400)
- Required fields must be present
- Contradictory inputs are detected and rejected

## Clinical Safety

The service automatically:
- Checks for diabetes, celiac, CKD, reflux, etc.
- Adds warnings for clinical conditions
- Sanitizes diet plans based on patient conditions
- Filters out unsafe ingredients

## Model Loading

- Models are loaded at startup
- If models contain pipelines, they're used directly
- Otherwise, encoders/scalers are built from the dataset
- Encoders are persisted for reproducibility

## Logging

All inference requests are logged with:
- Timestamp
- Payload hash (for privacy)
- Model version
- Warnings count
