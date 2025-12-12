"""
Model loading and preprocessing utilities
"""
import joblib
import pickle
import pandas as pd
import json
from pathlib import Path
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
# Import all sklearn components that might be in the model
from sklearn import base, ensemble, tree, linear_model, neural_network
from typing import Dict, Any, Optional
import logging
import warnings
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import xgboost if available (optional - models may work without it)
try:
    import xgboost
    XGBOOST_AVAILABLE = True
except (ImportError, Exception) as e:
    XGBOOST_AVAILABLE = False
    logger.warning(f"xgboost not available: {e}. Some models may not work.")

try:
    from .config import (
        AYUR_MODEL_PATH, PRAKRITI_MODEL_PATH, DATASET_XLSX_PATH,
        ENCODERS_PATH, SCALERS_PATH, MAPPINGS_PATH
    )
except ImportError:
    from config import (
        AYUR_MODEL_PATH, PRAKRITI_MODEL_PATH, DATASET_XLSX_PATH,
        ENCODERS_PATH, SCALERS_PATH, MAPPINGS_PATH
    )

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelLoader:
    """Load and manage ML models and preprocessors"""
    
    def __init__(self):
        self.ayur_model = None
        self.prakriti_model = None
        self.dataset = None
        self.encoders = {}
        self.scalers = {}
        self.column_order = []
        self.model_version = None
        
    def load_models(self):
        """Load models from pickle files"""
        try:
            # Suppress sklearn version warnings
            warnings.filterwarnings('ignore', category=UserWarning)
            
            # Try joblib first, fallback to pickle
            try:
                self.ayur_model = joblib.load(AYUR_MODEL_PATH)
                logger.info(f"Loaded ayur model from {AYUR_MODEL_PATH}")
            except Exception as e:
                logger.warning(f"joblib.load failed, trying pickle: {e}")
                try:
                    with open(AYUR_MODEL_PATH, 'rb') as f:
                        self.ayur_model = pickle.load(f)
                    logger.info(f"Loaded ayur model using pickle from {AYUR_MODEL_PATH}")
                except Exception as pickle_error:
                    logger.error(f"Both joblib and pickle failed: {pickle_error}")
                    raise RuntimeError(f"Failed to load ayur model: {pickle_error}")
            
            try:
                self.prakriti_model = joblib.load(PRAKRITI_MODEL_PATH)
                logger.info(f"Loaded prakriti model from {PRAKRITI_MODEL_PATH}")
            except Exception as e:
                logger.warning(f"joblib.load failed, trying pickle: {e}")
                try:
                    with open(PRAKRITI_MODEL_PATH, 'rb') as f:
                        self.prakriti_model = pickle.load(f)
                    logger.info(f"Loaded prakriti model using pickle from {PRAKRITI_MODEL_PATH}")
                except Exception as pickle_error:
                    logger.error(f"Both joblib and pickle failed: {pickle_error}")
                    raise RuntimeError(f"Failed to load prakriti model: {pickle_error}")
            
            # Set model version
            self.model_version = AYUR_MODEL_PATH.name
            
            # Check if model is a pipeline
            if hasattr(self.ayur_model, 'steps') or hasattr(self.ayur_model, 'named_steps'):
                logger.info("Model appears to be a pipeline - will use directly")
                self.is_pipeline = True
            else:
                logger.info("Model is a bare estimator - will build preprocessors")
                self.is_pipeline = False
                
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise RuntimeError(f"Failed to load models: {e}")
    
    def load_dataset(self):
        """Load reference dataset for encoder building"""
        try:
            self.dataset = pd.read_excel(DATASET_XLSX_PATH)
            logger.info(f"Loaded dataset with {len(self.dataset)} rows from {DATASET_XLSX_PATH}")
            return self.dataset
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            raise RuntimeError(f"Failed to load dataset: {e}")
    
    def build_encoders(self):
        """Build encoders from dataset if not using pipeline"""
        if self.is_pipeline:
            logger.info("Using pipeline - skipping encoder building")
            return
        
        if self.dataset is None:
            self.load_dataset()
        
        # Categorical columns that need encoding
        categorical_cols = [
            'diet_type', 'patient_region', 'prakriti', 'activity_level', 
            'season', 'gender', 'bowel_pattern', 'stress_level', 
            'snacking_habit', 'sugar_intake_level', 'therapeutic_goal',
            'patient_continent', 'patient_country'
        ]
        
        # Build label encoders for each categorical column
        for col in categorical_cols:
            if col in self.dataset.columns:
                try:
                    le = LabelEncoder()
                    # Handle NaN values
                    clean_values = self.dataset[col].astype(str).fillna('unknown')
                    le.fit(clean_values)
                    self.encoders[col] = le
                    logger.info(f"Built encoder for {col} with {len(le.classes_)} classes")
                except Exception as e:
                    logger.warning(f"Could not build encoder for {col}: {e}")
        
        # Save encoders
        try:
            joblib.dump(self.encoders, ENCODERS_PATH)
            logger.info(f"Saved encoders to {ENCODERS_PATH}")
        except Exception as e:
            logger.warning(f"Could not save encoders: {e}")
        
        # Build scalers for numeric columns if needed
        numeric_cols = [
            'age', 'height_cm', 'weight_kg', 'bmi', 'meal_frequency_per_day',
            'water_intake_liters', 'bowel_movements_per_day', 'sleep_hours',
            'physical_activity_minutes', 'outside_food_freq_per_week',
            'daily_calories', 'fasting_blood_sugar_mg_dl', 'systolic_bp',
            'diastolic_bp', 'waist_circumference_cm'
        ]
        
        for col in numeric_cols:
            if col in self.dataset.columns:
                try:
                    scaler = StandardScaler()
                    clean_values = self.dataset[col].fillna(self.dataset[col].mean())
                    scaler.fit(clean_values.values.reshape(-1, 1))
                    self.scalers[col] = scaler
                    logger.info(f"Built scaler for {col}")
                except Exception as e:
                    logger.warning(f"Could not build scaler for {col}: {e}")
        
        # Save scalers
        try:
            joblib.dump(self.scalers, SCALERS_PATH)
            logger.info(f"Saved scalers to {SCALERS_PATH}")
        except Exception as e:
            logger.warning(f"Could not save scalers: {e}")
        
        # Save mappings for documentation
        mappings = {}
        for col, encoder in self.encoders.items():
            mappings[col] = {
                'classes': encoder.classes_.tolist(),
                'n_classes': len(encoder.classes_)
            }
        
        try:
            with open(MAPPINGS_PATH, 'w') as f:
                json.dump(mappings, f, indent=2)
            logger.info(f"Saved mappings to {MAPPINGS_PATH}")
        except Exception as e:
            logger.warning(f"Could not save mappings: {e}")
    
    def load_encoders(self):
        """Load saved encoders if they exist"""
        if ENCODERS_PATH.exists():
            try:
                self.encoders = joblib.load(ENCODERS_PATH)
                logger.info(f"Loaded encoders from {ENCODERS_PATH}")
            except Exception as e:
                logger.warning(f"Could not load encoders: {e}")
        
        if SCALERS_PATH.exists():
            try:
                self.scalers = joblib.load(SCALERS_PATH)
                logger.info(f"Loaded scalers from {SCALERS_PATH}")
            except Exception as e:
                logger.warning(f"Could not load scalers: {e}")
    
    def preprocess_input(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Preprocess input data for model prediction"""
        if self.is_pipeline:
            # If using pipeline, convert to DataFrame and let pipeline handle preprocessing
            df = pd.DataFrame([data])
            return df
        
        # Otherwise, manually preprocess
        df = pd.DataFrame([data])
        
        # Encode categorical columns
        for col, encoder in self.encoders.items():
            if col in df.columns:
                try:
                    value = str(df[col].iloc[0]) if pd.notna(df[col].iloc[0]) else 'unknown'
                    if value in encoder.classes_:
                        df[col] = encoder.transform([value])[0]
                    else:
                        # Handle unseen values - use most common class
                        df[col] = 0  # or encoder.transform(['unknown'])[0]
                        logger.warning(f"Unseen value '{value}' for {col}, using default")
                except Exception as e:
                    logger.warning(f"Error encoding {col}: {e}")
                    df[col] = 0
        
        # Scale numeric columns
        for col, scaler in self.scalers.items():
            if col in df.columns:
                try:
                    value = df[col].iloc[0]
                    if pd.notna(value):
                        df[col] = scaler.transform([[value]])[0][0]
                    else:
                        df[col] = 0
                except Exception as e:
                    logger.warning(f"Error scaling {col}: {e}")
                    df[col] = 0
        
        # Fill NaN with 0
        df = df.fillna(0)
        
        return df
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Run prediction on input data"""
        try:
            # Preprocess
            X = self.preprocess_input(data)
            
            # Predict
            if hasattr(self.ayur_model, 'predict_proba'):
                pred_proba = self.ayur_model.predict_proba(X)
                pred = self.ayur_model.predict(X)
                
                # Get class names if available
                if hasattr(self.ayur_model, 'classes_'):
                    classes = self.ayur_model.classes_
                    proba_dict = {str(cls): float(prob) for cls, prob in zip(classes, pred_proba[0])}
                else:
                    proba_dict = {f"class_{i}": float(prob) for i, prob in enumerate(pred_proba[0])}
                
                return {
                    'pred_label': str(pred[0]) if hasattr(pred, '__iter__') else str(pred),
                    'pred_score': float(pred_proba[0].max()) if hasattr(pred_proba[0], 'max') else None,
                    'pred_proba': proba_dict,
                    'raw_output': {
                        'prediction': pred.tolist() if hasattr(pred, 'tolist') else [pred],
                        'probabilities': pred_proba.tolist() if hasattr(pred_proba, 'tolist') else pred_proba
                    }
                }
            else:
                pred = self.ayur_model.predict(X)
                return {
                    'pred_label': str(pred[0]) if hasattr(pred, '__iter__') else str(pred),
                    'pred_score': None,
                    'pred_proba': None,
                    'raw_output': {
                        'prediction': pred.tolist() if hasattr(pred, 'tolist') else [pred]
                    }
                }
        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            raise RuntimeError(f"Prediction failed: {e}")


# Global model loader instance
model_loader = ModelLoader()

def initialize_models():
    """Initialize models at startup"""
    try:
        model_loader.load_models()
        model_loader.load_dataset()
        
        # Try to load existing encoders first
        model_loader.load_encoders()
        
        # Build encoders if not using pipeline and encoders don't exist
        if not model_loader.is_pipeline and not model_loader.encoders:
            model_loader.build_encoders()
        
        logger.info("Models initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to initialize models: {e}")
        raise
