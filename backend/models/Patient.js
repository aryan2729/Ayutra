import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    // Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    
    // Basic Info
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age must be positive'],
      max: [150, 'Age must be realistic'],
    },
    height_cm: {
      type: Number,
      min: [0, 'Height must be positive'],
    },
    weight_kg: {
      type: Number,
      min: [0, 'Weight must be positive'],
    },
    bmi: {
      type: Number,
      min: [0, 'BMI must be positive'],
    },
    patient_continent: {
      type: String,
      trim: true,
    },
    patient_country: {
      type: String,
      trim: true,
    },
    patient_region: {
      type: String,
      trim: true,
    },
    
    // Diet & Nutrition
    meal_frequency_per_day: {
      type: String,
      trim: true,
    },
    water_intake_liters: {
      type: Number,
      min: [0, 'Water intake must be positive'],
    },
    diet_type: {
      type: String,
      trim: true,
    },
    snacking_habit: {
      type: String,
      trim: true,
    },
    outside_food_freq_per_week: {
      type: String,
      trim: true,
    },
    sugar_intake_level: {
      type: String,
      trim: true,
    },
    vegetarian: {
      type: Boolean,
      default: false,
    },
    vegan: {
      type: Boolean,
      default: false,
    },
    gluten_free: {
      type: Boolean,
      default: false,
    },
    nut_free: {
      type: Boolean,
      default: false,
    },
    diabetic_friendly: {
      type: Boolean,
      default: false,
    },
    dairy_free: {
      type: Boolean,
      default: false,
    },
    low_sodium: {
      type: Boolean,
      default: false,
    },
    ketogenic: {
      type: Boolean,
      default: false,
    },
    exclude_ingredients: {
      type: [String],
      default: [],
    },
    
    // Prakriti (Dosha)
    prakriti: {
      type: String,
      trim: true,
    },
    vata_state: {
      type: String,
      trim: true,
    },
    pitta_state: {
      type: String,
      trim: true,
    },
    kapha_state: {
      type: String,
      trim: true,
    },
    
    // Digestion
    bowel_pattern: {
      type: String,
      trim: true,
    },
    bowel_movements_per_day: {
      type: Number,
      min: [0, 'Bowel movements must be positive'],
    },
    
    // Sleep & Mental
    sleep_hours: {
      type: Number,
      min: [0, 'Sleep hours must be positive'],
      max: [24, 'Sleep hours cannot exceed 24'],
    },
    stress_level: {
      type: String,
      trim: true,
    },
    
    // Lifestyle
    physical_activity_minutes: {
      type: Number,
      min: [0, 'Activity minutes must be positive'],
    },
    activity_level: {
      type: String,
      trim: true,
    },
    season: {
      type: String,
      trim: true,
    },
    therapeutic_goal: {
      type: String,
      trim: true,
    },
    daily_calories: {
      type: Number,
      min: [0, 'Daily calories must be positive'],
    },
    
    // Medical Conditions
    has_diabetes: {
      type: Boolean,
      default: false,
    },
    has_hypertension: {
      type: Boolean,
      default: false,
    },
    has_obesity: {
      type: Boolean,
      default: false,
    },
    has_dyslipidemia: {
      type: Boolean,
      default: false,
    },
    has_acidity_reflux: {
      type: Boolean,
      default: false,
    },
    has_ckd: {
      type: Boolean,
      default: false,
    },
    has_celiac: {
      type: Boolean,
      default: false,
    },
    has_ibs_ibd: {
      type: Boolean,
      default: false,
    },
    has_nafld: {
      type: Boolean,
      default: false,
    },
    has_thyroid: {
      type: Boolean,
      default: false,
    },
    has_pcod_pcos: {
      type: Boolean,
      default: false,
    },
    
    // Lab Reports
    fasting_blood_sugar_mg_dl: {
      type: Number,
      min: [0, 'Blood sugar must be positive'],
    },
    systolic_bp: {
      type: Number,
      min: [0, 'Blood pressure must be positive'],
    },
    diastolic_bp: {
      type: Number,
      min: [0, 'Blood pressure must be positive'],
    },
    waist_circumference_cm: {
      type: Number,
      min: [0, 'Waist circumference must be positive'],
    },
    
    // Additional Notes
    notes: {
      type: String,
      trim: true,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
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

// Indexes for faster queries
patientSchema.index({ user: 1 });
patientSchema.index({ prakriti: 1 });
patientSchema.index({ isActive: 1 });

// Calculate BMI before saving if height and weight are provided
patientSchema.pre('save', function (next) {
  if (this.height_cm && this.weight_kg && !this.bmi) {
    const heightInMeters = this.height_cm / 100;
    this.bmi = this.weight_kg / (heightInMeters * heightInMeters);
    this.bmi = Math.round(this.bmi * 10) / 10; // Round to 1 decimal place
  }
  next();
});

// Static method to find patient by user ID
patientSchema.statics.findByUserId = async function (userId) {
  return await this.findOne({ user: userId }).populate('user', '-password');
};

// Static method to find active patients
patientSchema.statics.findActivePatients = async function () {
  return await this.find({ isActive: true }).populate('user', '-password');
};

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
