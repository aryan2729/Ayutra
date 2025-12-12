"""
Configuration for ML service
"""
import os
from pathlib import Path

# Base directory - adjust based on your project structure
BASE_DIR = Path(__file__).resolve().parent.parent

# Model files location
MODELS_DIR = BASE_DIR / "model"

# Model file paths
AYUR_MODEL_PATH = MODELS_DIR / "ayur_xgb_model.pkl"
PRAKRITI_MODEL_PATH = MODELS_DIR / "prakriti_model.pkl"
DATASET_XLSX_PATH = MODELS_DIR / "AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx"

# Encoders and scalers persistence
ENCODERS_PATH = MODELS_DIR / "encoders.joblib"
SCALERS_PATH = MODELS_DIR / "scalers.joblib"
MAPPINGS_PATH = MODELS_DIR / "mappings.json"

# Validate paths exist
def validate_paths():
    """Validate that all required model files exist"""
    missing = []
    
    if not AYUR_MODEL_PATH.exists():
        missing.append(str(AYUR_MODEL_PATH))
    if not PRAKRITI_MODEL_PATH.exists():
        missing.append(str(PRAKRITI_MODEL_PATH))
    if not DATASET_XLSX_PATH.exists():
        missing.append(str(DATASET_XLSX_PATH))
    
    if missing:
        raise RuntimeError(f"Missing model or dataset files: {', '.join(missing)}")
    
    return True

# Allowed input keys (exact names)
ALLOWED_KEYS = [
    'gender', 'age', 'height_cm', 'weight_kg', 'bmi', 'patient_continent', 
    'patient_country', 'patient_region', 'meal_frequency_per_day', 
    'water_intake_liters', 'bowel_pattern', 'bowel_movements_per_day',
    'sleep_hours', 'stress_level', 'physical_activity_minutes', 'diet_type', 
    'snacking_habit', 'outside_food_freq_per_week', 'sugar_intake_level', 
    'prakriti', 'vata_state', 'pitta_state', 'kapha_state', 'has_diabetes', 
    'has_hypertension', 'has_obesity', 'has_dyslipidemia', 'has_acidity_reflux', 
    'has_ckd', 'has_celiac', 'has_ibs_ibd', 'has_nafld', 'has_thyroid', 
    'has_pcod_pcos', 'fasting_blood_sugar_mg_dl', 'systolic_bp', 'diastolic_bp',
    'waist_circumference_cm', 'activity_level', 'season', 'therapeutic_goal', 
    'daily_calories', 'vegetarian', 'vegan', 'gluten_free', 'nut_free', 
    'diabetic_friendly', 'dairy_free', 'low_sodium', 'ketogenic', 
    'exclude_ingredients'
]

# Required minimal fields
REQUIRED_FIELDS = [
    'gender', 'age', 'height_cm', 'weight_kg', 'daily_calories', 
    'diet_type', 'prakriti'
]
