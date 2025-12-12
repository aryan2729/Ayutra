import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';


import { connectDB } from '../config/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';


router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log('🔐 Login request received:', { email, role });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email and password are required',
          code: 'MISSING_CREDENTIALS',
          status: 400
        }
      });
    }

    // Ensure MongoDB connection
    await connectDB();

    // Find user by email or username using MongoDB
    console.log('🔍 Searching for user...');
    const user = await User.findByEmailOrUsername(email);

    if (!user) {
      console.log('⚠️ User not found:', email);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          status: 401
        }
      });
    }

    console.log('✅ User found:', user.email);

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED',
          status: 403
        }
      });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          status: 401
        }
      });
    }

    // Verify password using model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
          status: 401
        }
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate tokens using MongoDB _id
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id.toString(),
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Return success response
    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || null
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
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
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'Patient' } = req.body;

    console.log('📝 Register request received:', { email, name, role });

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email, password, and name are required',
          code: 'MISSING_FIELDS',
          status: 400
        }
      });
    }

    // Ensure MongoDB connection
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(409).json({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS',
          status: 409
        }
      });
    }

    // Create new user (password will be hashed automatically by pre-save hook)
    console.log('🔄 Creating new user...');
    const newUser = await User.create({
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save hook
      name,
      role,
      image: null,
    });

    console.log('✅ User created successfully:', newUser.email, newUser._id);

    // Generate tokens using MongoDB _id
    const token = jwt.sign(
      {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        id: newUser._id.toString(),
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          image: newUser.image || null
        }
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
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
 * POST /api/auth/logout
 * Logout user (client-side token removal, but we log it)
 */
router.post('/logout', (req, res) => {
  // In a real app, you might want to blacklist the token
  // For now, we just return success
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token is required',
          code: 'MISSING_TOKEN',
          status: 400
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Find user in MongoDB
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid refresh token',
          code: 'INVALID_TOKEN',
          status: 401
        }
      });
    }

    // Generate new access token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Optionally generate new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: user._id.toString(),
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired refresh token',
        code: 'INVALID_TOKEN',
        status: 401
      }
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header
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

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user in MongoDB
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND',
          status: 401
        }
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || null
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        status: 401
      }
    });
  }
});

/**
 * POST /api/auth/google
 * Google OAuth login (placeholder)
 */
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Google token is required',
          code: 'MISSING_TOKEN',
          status: 400
        }
      });
    }

    // TODO: Verify Google token with Google API
    // For now, return a placeholder response
    res.status(501).json({
      success: false,
      error: {
        message: 'Google OAuth not yet implemented',
        code: 'NOT_IMPLEMENTED',
        status: 501
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

/**
 * POST /api/auth/apple
 * Apple OAuth login (placeholder)
 */
router.post('/apple', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Apple token is required',
          code: 'MISSING_TOKEN',
          status: 400
        }
      });
    }

    // TODO: Verify Apple token with Apple API
    // For now, return a placeholder response
    res.status(501).json({
      success: false,
      error: {
        message: 'Apple OAuth not yet implemented',
        code: 'NOT_IMPLEMENTED',
        status: 501
      }
    });
  } catch (error) {
    console.error('Apple login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        status: 500
      }
    });
  }
});

export { router as authRoutes };
