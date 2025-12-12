import mongoose from 'mongoose';

const mealComplianceSchema = new mongoose.Schema(
  {
    // Reference to User (patient)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    
    // Date of the meal
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    
    // Day of week (monday, tuesday, etc.)
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: [true, 'Day of week is required'],
    },
    
    // Meal type
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner'],
      required: [true, 'Meal type is required'],
    },
    
    // Meal ID from diet plan
    mealId: {
      type: String,
      required: [true, 'Meal ID is required'],
    },
    
    // Whether the meal was consumed
    consumed: {
      type: Boolean,
      default: false,
    },
    
    // Timestamp when marked as consumed
    consumedAt: {
      type: Date,
      default: null,
    },
    
    // Optional notes
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for efficient queries
mealComplianceSchema.index({ user: 1, date: 1, mealType: 1 }, { unique: true });
mealComplianceSchema.index({ user: 1, dayOfWeek: 1 });

// Static method to get compliance for a date range
mealComplianceSchema.statics.getComplianceForDateRange = async function (userId, startDate, endDate) {
  return await this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: 1, mealType: 1 });
};

// Static method to get daily compliance
mealComplianceSchema.statics.getDailyCompliance = async function (userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const meals = await this.find({
    user: userId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
  
  const totalMeals = meals.length;
  const consumedMeals = meals.filter(m => m.consumed).length;
  
  return {
    total: totalMeals,
    consumed: consumedMeals,
    percentage: totalMeals > 0 ? Math.round((consumedMeals / totalMeals) * 100) : 0,
    meals: meals,
  };
};

// Static method to get weekly compliance
mealComplianceSchema.statics.getWeeklyCompliance = async function (userId, weekStartDate) {
  const startOfWeek = new Date(weekStartDate);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(weekStartDate);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const meals = await this.find({
    user: userId,
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });
  
  // Group by day
  const dailyData = {};
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  days.forEach(day => {
    const dayMeals = meals.filter(m => m.dayOfWeek === day);
    const consumed = dayMeals.filter(m => m.consumed).length;
    const total = dayMeals.length;
    
    dailyData[day] = {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      compliance: total > 0 ? Math.round((consumed / total) * 100) : 0,
      consumed,
      total,
    };
  });
  
  const totalMeals = meals.length;
  const consumedMeals = meals.filter(m => m.consumed).length;
  
  return {
    overall: totalMeals > 0 ? Math.round((consumedMeals / totalMeals) * 100) : 0,
    daily: dailyData,
    total: totalMeals,
    consumed: consumedMeals,
  };
};

const MealCompliance = mongoose.model('MealCompliance', mealComplianceSchema);

export default MealCompliance;
