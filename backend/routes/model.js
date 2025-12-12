/**
 * Model inference routes
 * Proxies requests to Python ML service
 */
import express from 'express';
import axios from 'axios';

const router = express.Router();

// ML Service URL - configure via environment variable
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Health check for ML service
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/api/model/health`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'ML service unavailable',
        code: 'ML_SERVICE_ERROR',
        status: 500,
        details: error.message
      }
    });
  }
});

/**
 * Model prediction endpoint
 * Proxies to Python ML service
 */
router.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/model/predict`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    if (error.response) {
      // Python service returned an error
      res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    } else if (error.request) {
      // Request made but no response
      res.status(503).json({
        success: false,
        error: {
          message: 'ML service unavailable',
          code: 'ML_SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    } else {
      // Error setting up request
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          status: 500,
          details: error.message
        }
      });
    }
  }
});

/**
 * Diet plan generation endpoint
 * Proxies to Python ML service
 */
router.post('/dietplan', async (req, res) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/model/dietplan`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for full diet plan
      }
    );
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data
      });
    } else if (error.request) {
      res.status(503).json({
        success: false,
        error: {
          message: 'ML service unavailable',
          code: 'ML_SERVICE_UNAVAILABLE',
          status: 503
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
          status: 500,
          details: error.message
        }
      });
    }
  }
});

export { router as modelRoutes };
