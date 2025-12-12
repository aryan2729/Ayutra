"""
FastAPI application for ML model inference
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
from typing import Dict, Any
import hashlib
import json

try:
    from .config import validate_paths, ALLOWED_KEYS
    from .schemas import PatientInput, PredictionResponse, ModelOutput
    from .model_loader import initialize_models, model_loader
    from .clinical_safety import ClinicalSafetyChecker
except ImportError:
    from config import validate_paths, ALLOWED_KEYS
    from schemas import PatientInput, PredictionResponse, ModelOutput
    from model_loader import initialize_models, model_loader
    from clinical_safety import ClinicalSafetyChecker

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Ayutra ML Service",
    description="ML model inference API for Ayurvedic diet generation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global safety checker
safety_checker = ClinicalSafetyChecker()

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    try:
        validate_paths()
        initialize_models()
        logger.info("ML Service started successfully")
    except Exception as e:
        logger.error(f"Failed to start ML service: {e}")
        raise


@app.get("/api/model/health")
async def health_check():
    """Health check endpoint"""
    try:
        return {
            "status": "healthy",
            "model_version": model_loader.model_version if model_loader.model_version else "unknown",
            "models_loaded": model_loader.ayur_model is not None and model_loader.prakriti_model is not None,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e)}
        )


@app.post("/api/model/predict", response_model=PredictionResponse)
async def predict(request: Request, payload: PatientInput):
    """
    Main prediction endpoint
    
    Accepts only whitelisted input keys and returns model predictions
    """
    try:
        # Convert Pydantic model to dict
        data = payload.model_dump(exclude_none=True)
        
        # Sanitize - ensure only allowed keys
        sanitized = {k: v for k, v in data.items() if k in ALLOWED_KEYS}
        
        # Log request (hash payload for privacy)
        payload_hash = hashlib.sha256(json.dumps(sanitized, sort_keys=True).encode()).hexdigest()[:16]
        logger.info(f"Prediction request - hash: {payload_hash}, model_version: {model_loader.model_version}")
        
        # Run prediction
        model_output = model_loader.predict(sanitized)
        
        # Check clinical safety
        warnings = safety_checker.check_safety(sanitized, model_output)
        
        # Build response
        response = PredictionResponse(
            meta={
                "model_version": model_loader.model_version or "unknown",
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "dataset_path": str(model_loader.dataset) if hasattr(model_loader, 'dataset') else None
            },
            patient=sanitized,
            model_output=model_output,
            warnings=warnings,
            diet_plan=None  # Will be generated separately if needed
        )
        
        logger.info(f"Prediction completed - hash: {payload_hash}, warnings: {len(warnings)}")
        
        return response
        
    except ValueError as e:
        # Validation errors from Pydantic
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/api/model/dietplan")
async def generate_diet_plan(request: Request, payload: PatientInput):
    """
    Full end-to-end diet plan generation
    
    Runs model prediction and generates complete diet plan JSON
    """
    try:
        # Convert to dict and sanitize
        data = payload.model_dump(exclude_none=True)
        sanitized = {k: v for k, v in data.items() if k in ALLOWED_KEYS}
        
        # Log request
        payload_hash = hashlib.sha256(json.dumps(sanitized, sort_keys=True).encode()).hexdigest()[:16]
        logger.info(f"Diet plan generation request - hash: {payload_hash}")
        
        # Run prediction
        model_output = model_loader.predict(sanitized)
        
        # Check clinical safety
        warnings = safety_checker.check_safety(sanitized, model_output)
        
        # Generate diet plan (placeholder - integrate with LLM or rule-based system)
        diet_plan = {
            "plan_summary": {
                "total_calories": sanitized.get('daily_calories', 2000),
                "diet_type": sanitized.get('diet_type', 'balanced'),
                "duration_weeks": 4
            },
            "meals": [],  # Will be populated by diet generation logic
            "shopping_list": [],
            "notes": warnings.copy()
        }
        
        # Sanitize diet plan based on clinical conditions
        diet_plan = safety_checker.sanitize_diet_plan(diet_plan, sanitized)
        
        # Build response
        response = {
            "meta": {
                "model_version": model_loader.model_version or "unknown",
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "dataset_path": str(model_loader.dataset) if hasattr(model_loader, 'dataset') else None
            },
            "patient": sanitized,
            "model_output": model_output,
            "warnings": warnings,
            "diet_plan": diet_plan
        }
        
        logger.info(f"Diet plan generated - hash: {payload_hash}")
        
        return response
        
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Diet plan generation error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Diet plan generation failed: {str(e)}")


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.detail,
                "code": exc.status_code,
                "status": exc.status_code
            }
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
