"""
Pydantic schemas for strict input validation
"""
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, List, Literal
from config import ALLOWED_KEYS, REQUIRED_FIELDS


class PatientInput(BaseModel):
    """Strict input schema - only allowed keys, extra fields forbidden"""
    
    # Basic Info
    gender: Optional[str] = None
    age: Optional[float] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    bmi: Optional[float] = None
    patient_continent: Optional[str] = None
    patient_country: Optional[str] = None
    patient_region: Optional[str] = None
    
    # Diet & Nutrition
    meal_frequency_per_day: Optional[str] = None
    water_intake_liters: Optional[float] = None
    diet_type: Optional[str] = None
    snacking_habit: Optional[str] = None
    outside_food_freq_per_week: Optional[str] = None
    sugar_intake_level: Optional[str] = None
    
    # Prakriti
    prakriti: Optional[str] = None
    vata_state: Optional[str] = None
    pitta_state: Optional[str] = None
    kapha_state: Optional[str] = None
    
    # Digestion
    bowel_pattern: Optional[str] = None
    bowel_movements_per_day: Optional[float] = None
    
    # Sleep & Mental
    sleep_hours: Optional[float] = None
    stress_level: Optional[str] = None
    
    # Lifestyle
    physical_activity_minutes: Optional[float] = None
    activity_level: Optional[str] = None
    season: Optional[str] = None
    therapeutic_goal: Optional[str] = None
    daily_calories: Optional[float] = None
    
    # Medical Conditions (boolean)
    has_diabetes: Optional[bool] = False
    has_hypertension: Optional[bool] = False
    has_obesity: Optional[bool] = False
    has_dyslipidemia: Optional[bool] = False
    has_acidity_reflux: Optional[bool] = False
    has_ckd: Optional[bool] = False
    has_celiac: Optional[bool] = False
    has_ibs_ibd: Optional[bool] = False
    has_nafld: Optional[bool] = False
    has_thyroid: Optional[bool] = False
    has_pcod_pcos: Optional[bool] = False
    
    # Lab Reports
    fasting_blood_sugar_mg_dl: Optional[float] = None
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    waist_circumference_cm: Optional[float] = None
    
    # Dietary Preferences (boolean)
    vegetarian: Optional[bool] = False
    vegan: Optional[bool] = False
    gluten_free: Optional[bool] = False
    nut_free: Optional[bool] = False
    diabetic_friendly: Optional[bool] = False
    dairy_free: Optional[bool] = False
    low_sodium: Optional[bool] = False
    ketogenic: Optional[bool] = False
    
    # Exclude ingredients
    exclude_ingredients: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        extra = "forbid"  # Reject any extra fields
        json_schema_extra = {
            "example": {
                "gender": "male",
                "age": 35,
                "height_cm": 175,
                "weight_kg": 75,
                "daily_calories": 2000,
                "diet_type": "vegetarian",
                "prakriti": "Vata-Pitta"
            }
        }
    
    @model_validator(mode='after')
    def validate_required_fields(self):
        """Check required fields are present"""
        missing = []
        for field in REQUIRED_FIELDS:
            value = getattr(self, field)
            if value is None or value == '':
                missing.append(field)
        
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        return self
    
    @model_validator(mode='after')
    def validate_contradictions(self):
        """Check for contradictory inputs"""
        contradictions = []
        
        # Vegan should imply vegetarian
        if self.vegan and self.vegetarian is False:
            contradictions.append("vegan=true but vegetarian=false")
        
        # Celiac should imply gluten_free
        if self.has_celiac and self.gluten_free is False:
            contradictions.append("has_celiac=true but gluten_free=false")
        
        # Diabetes should imply diabetic_friendly
        if self.has_diabetes and self.diabetic_friendly is False:
            contradictions.append("has_diabetes=true but diabetic_friendly=false")
        
        if contradictions:
            raise ValueError(f"Contradictory inputs: {', '.join(contradictions)}")
        
        return self


class ModelOutput(BaseModel):
    """Model prediction output"""
    pred_label: Optional[str] = None
    pred_score: Optional[float] = None
    pred_proba: Optional[dict] = None
    raw_output: Optional[dict] = None


class PredictionResponse(BaseModel):
    """API response schema"""
    meta: dict = Field(..., description="Model metadata")
    patient: dict = Field(..., description="Sanitized patient input")
    model_output: dict = Field(..., description="Model prediction results")
    warnings: List[str] = Field(default_factory=list, description="Clinical safety warnings")
    diet_plan: Optional[dict] = None
