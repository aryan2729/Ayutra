"""
Test script to verify model loading and basic inference
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from ml_service.config import validate_paths
from ml_service.model_loader import initialize_models, model_loader

def test_model_loading():
    """Test that models can be loaded"""
    print("Testing model loading...")
    
    try:
        validate_paths()
        print("✓ Model files found")
        
        initialize_models()
        print("✓ Models loaded successfully")
        print(f"  Model version: {model_loader.model_version}")
        print(f"  Is pipeline: {model_loader.is_pipeline}")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_prediction():
    """Test a basic prediction"""
    print("\nTesting prediction...")
    
    test_data = {
        "gender": "male",
        "age": 35,
        "height_cm": 175,
        "weight_kg": 75,
        "bmi": 24.5,
        "daily_calories": 2000,
        "diet_type": "vegetarian",
        "prakriti": "Vata-Pitta",
        "meal_frequency_per_day": "3",
        "water_intake_liters": 2.5,
        "sleep_hours": 7,
        "stress_level": "moderate",
        "physical_activity_minutes": 30,
        "activity_level": "moderate"
    }
    
    try:
        result = model_loader.predict(test_data)
        print("✓ Prediction successful")
        print(f"  Result: {result}")
        return True
    except Exception as e:
        print(f"✗ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Ayutra - Model Testing")
    print("=" * 50)
    
    if test_model_loading():
        test_prediction()
    
    print("\n" + "=" * 50)
    print("Testing complete")
    print("=" * 50)
