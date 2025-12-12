import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import MealCompliance from '../models/MealCompliance.js';
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

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
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
 * POST /api/compliance/meal
 * Mark a meal as consumed/not consumed
 */
router.post('/meal', authenticateToken, async (req, res) => {
  try {
    const { date, dayOfWeek, mealType, mealId, consumed } = req.body;
    const userId = req.user.id;

    // Validation
    if (!date || !dayOfWeek || !mealType || !mealId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Date, dayOfWeek, mealType, and mealId are required',
          code: 'MISSING_FIELDS',
          status: 400
        }
      });
    }

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

    // Verify user exists
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

    // Patients can only update their own compliance
    if (req.user.role === 'Patient' && userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied',
          code: 'ACCESS_DENIED',
          status: 403
        }
      });
    }

    // Parse date
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    // Find or create meal compliance record
    const compliance = await MealCompliance.findOneAndUpdate(
      {
        user: userId,
        date: mealDate,
        mealType: mealType,
      },
      {
        user: userId,
        date: mealDate,
        dayOfWeek: dayOfWeek,
        mealType: mealType,
        mealId: mealId,
        consumed: consumed !== undefined ? consumed : true,
        consumedAt: consumed !== false ? new Date() : null,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      data: {
        compliance: compliance
      },
      message: `Meal marked as ${compliance.consumed ? 'consumed' : 'not consumed'}`
    });
  } catch (error) {
    console.error('❌ Update meal compliance error:', error);
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
 * GET /api/compliance/daily
 * Get daily compliance for a specific date
 */
router.get('/daily', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Date is required',
          code: 'MISSING_DATE',
          status: 400
        }
      });
    }

    const targetDate = new Date(date);
    const compliance = await MealCompliance.getDailyCompliance(userId, targetDate);

    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    console.error('❌ Get daily compliance error:', error);
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
 * GET /api/compliance/weekly
 * Get weekly compliance
 */
router.get('/weekly', authenticateToken, async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user.id;

    // Default to current week if not provided
    const weekStartDate = weekStart ? new Date(weekStart) : new Date();
    // Get Monday of the week
    const day = weekStartDate.getDay();
    const diff = weekStartDate.getDate() - day + (day === 0 ? -6 : 1);
    weekStartDate.setDate(diff);
    weekStartDate.setHours(0, 0, 0, 0);

    const compliance = await MealCompliance.getWeeklyCompliance(userId, weekStartDate);

    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    console.error('❌ Get weekly compliance error:', error);
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
 * GET /api/compliance/monthly
 * Get monthly compliance summary
 */
router.get('/monthly', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    // Default to current month if not provided
    const now = new Date();
    const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const meals = await MealCompliance.getComplianceForDateRange(userId, startDate, endDate);

    const totalMeals = meals.length;
    const consumedMeals = meals.filter(m => m.consumed).length;
    const overallPercentage = totalMeals > 0 ? Math.round((consumedMeals / totalMeals) * 100) : 0;

    // Group meals by day to calculate daily compliance
    const mealsByDate = {};
    meals.forEach(meal => {
      const dateKey = new Date(meal.date).toISOString().split('T')[0];
      if (!mealsByDate[dateKey]) {
        mealsByDate[dateKey] = [];
      }
      mealsByDate[dateKey].push(meal);
    });

    // Calculate daily compliance percentages
    const dailyCompliances = Object.values(mealsByDate).map(dayMeals => {
      const dayTotal = dayMeals.length;
      const dayConsumed = dayMeals.filter(m => m.consumed).length;
      return dayTotal > 0 ? Math.round((dayConsumed / dayTotal) * 100) : 0;
    });

    // Categorize days into compliance levels
    let excellent = 0, good = 0, fair = 0, poor = 0;
    dailyCompliances.forEach(percentage => {
      if (percentage >= 90) {
        excellent++;
      } else if (percentage >= 75) {
        good++;
      } else if (percentage >= 50) {
        fair++;
      } else {
        poor++;
      }
    });

    const totalDays = dailyCompliances.length;
    const complianceData = totalDays > 0 ? [
      { name: 'Excellent', value: Math.round((excellent / totalDays) * 100) },
      { name: 'Good', value: Math.round((good / totalDays) * 100) },
      { name: 'Fair', value: Math.round((fair / totalDays) * 100) },
      { name: 'Poor', value: Math.round((poor / totalDays) * 100) },
    ] : [
      { name: 'Excellent', value: 0 },
      { name: 'Good', value: 0 },
      { name: 'Fair', value: 0 },
      { name: 'Poor', value: 0 },
    ];

    res.json({
      success: true,
      data: {
        overall: overallPercentage,
        total: totalMeals,
        consumed: consumedMeals,
        breakdown: complianceData,
        meals: meals,
      }
    });
  } catch (error) {
    console.error('❌ Get monthly compliance error:', error);
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

export { router as complianceRoutes };
