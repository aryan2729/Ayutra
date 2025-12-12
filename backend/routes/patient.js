import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

/**
 * Middleware to verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authorization token required',
          code: 'UNAUTHORIZED',
          status: 401
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        status: 401
      }
    });
  }
};

/**
 * POST /api/patients
 * Add a new patient profile
 * Requires authentication
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const patientData = req.body;
    const userId = req.user.id;

    console.log('📝 Add patient request received for user:', userId);

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected!');
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database connection error',
          code: 'DB_ERROR',
          status: 500
        }
      });
    }

    // Verify user exists and has Patient role (or Admin/Practitioner can add patients)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 404
        }
      });
    }

    // Check if patient profile already exists for this user
    const existingPatient = await Patient.findOne({ user: userId });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Patient profile already exists for this user. Use PUT /api/patients/:id to update.',
          code: 'PATIENT_EXISTS',
          status: 409
        }
      });
    }

    // If user is Admin or Practitioner, they can specify a different user ID
    let targetUserId = userId;
    if ((req.user.role === 'Admin' || req.user.role === 'Practitioner') && patientData.userId) {
      targetUserId = patientData.userId;
      // Verify target user exists
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Target user not found',
            code: 'USER_NOT_FOUND',
            status: 404
          }
        });
      }
      // Check if patient profile already exists for target user
      const existingTargetPatient = await Patient.findOne({ user: targetUserId });
      if (existingTargetPatient) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Patient profile already exists for the target user',
            code: 'PATIENT_EXISTS',
            status: 409
          }
        });
      }
    }

    // Prepare patient data (remove userId from patientData if present)
    const { userId: _, ...cleanPatientData } = patientData;
    
    // Create new patient profile
    const newPatient = await Patient.create({
      user: targetUserId,
      ...cleanPatientData,
    });

    // Populate user data
    await newPatient.populate('user', '-password');

    console.log('✅ Patient profile created successfully:', newPatient._id);

    res.status(201).json({
      success: true,
      data: {
        patient: newPatient
      },
      message: 'Patient profile created successfully'
    });
  } catch (error) {
    console.error('❌ Add patient error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: errors.join(', '),
          code: 'VALIDATION_ERROR',
          status: 400
        }
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Patient profile already exists for this user',
          code: 'DUPLICATE_PATIENT',
          status: 409
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

/**
 * GET /api/patients
 * Get all patients (Admin/Practitioner only) or own patient profile
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database connection error',
          code: 'DB_ERROR',
          status: 500
        }
      });
    }

    let patients;

    // Admin and Practitioner can see all patients
    if (userRole === 'Admin' || userRole === 'Practitioner') {
      patients = await Patient.find({ isActive: true })
        .populate('user', '-password')
        .sort({ createdAt: -1 });
    } else {
      // Patients can only see their own profile
      patients = await Patient.find({ user: userId, isActive: true })
        .populate('user', '-password');
    }

    res.json({
      success: true,
      data: {
        patients: patients,
        count: patients.length
      }
    });
  } catch (error) {
    console.error('❌ Get patients error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

/**
 * GET /api/patients/:id
 * Get patient by ID
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database connection error',
          code: 'DB_ERROR',
          status: 500
        }
      });
    }

    const patient = await Patient.findById(patientId).populate('user', '-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Patient profile not found',
          code: 'PATIENT_NOT_FOUND',
          status: 404
        }
      });
    }

    // Patients can only see their own profile (unless Admin/Practitioner)
    if (userRole === 'Patient' && patient.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. You can only view your own patient profile.',
          code: 'ACCESS_DENIED',
          status: 403
        }
      });
    }

    res.json({
      success: true,
      data: {
        patient: patient
      }
    });
  } catch (error) {
    console.error('❌ Get patient error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid patient ID',
          code: 'INVALID_ID',
          status: 400
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

/**
 * GET /api/patients/user/:userId
 * Get patient profile by user ID
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database connection error',
          code: 'DB_ERROR',
          status: 500
        }
      });
    }

    // Patients can only see their own profile
    if (userRole === 'Patient' && targetUserId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. You can only view your own patient profile.',
          code: 'ACCESS_DENIED',
          status: 403
        }
      });
    }

    const patient = await Patient.findOne({ user: targetUserId })
      .populate('user', '-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Patient profile not found for this user',
          code: 'PATIENT_NOT_FOUND',
          status: 404
        }
      });
    }

    res.json({
      success: true,
      data: {
        patient: patient
      }
    });
  } catch (error) {
    console.error('❌ Get patient by user ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

/**
 * PUT /api/patients/:id
 * Update patient profile
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const updateData = req.body;

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database connection error',
          code: 'DB_ERROR',
          status: 500
        }
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Patient profile not found',
          code: 'PATIENT_NOT_FOUND',
          status: 404
        }
      });
    }

    // Patients can only update their own profile (unless Admin/Practitioner)
    if (userRole === 'Patient' && patient.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied. You can only update your own patient profile.',
          code: 'ACCESS_DENIED',
          status: 403
        }
      });
    }

    // Remove userId from update data if present (can't change user reference)
    const { userId: _, ...cleanUpdateData } = updateData;

    // Update patient
    Object.assign(patient, cleanUpdateData);
    await patient.save();

    await patient.populate('user', '-password');

    res.json({
      success: true,
      data: {
        patient: patient
      },
      message: 'Patient profile updated successfully'
    });
  } catch (error) {
    console.error('❌ Update patient error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: errors.join(', '),
          code: 'VALIDATION_ERROR',
          status: 400
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

export { router as patientRoutes };
