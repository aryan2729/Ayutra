import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { authRoutes } from './routes/auth.js';
import { modelRoutes } from './routes/model.js';
import { patientRoutes } from './routes/patient.js';
import { complianceRoutes } from './routes/compliance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4028',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Ayutra API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/compliance', complianceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
      status: 404
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      status: err.status || 500
    }
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🤖 Model endpoints: http://localhost:${PORT}/api/model`);
      console.log(`   - Health: GET /api/model/health`);
      console.log(`   - Predict: POST /api/model/predict`);
      console.log(`   - Diet Plan: POST /api/model/dietplan`);
      console.log(`👤 Patient endpoints: http://localhost:${PORT}/api/patients`);
      console.log(`   - Add: POST /api/patients`);
      console.log(`   - Get All: GET /api/patients`);
      console.log(`   - Get by ID: GET /api/patients/:id`);
      console.log(`   - Update: PUT /api/patients/:id`);
      console.log(`✅ Compliance endpoints: http://localhost:${PORT}/api/compliance`);
      console.log(`   - Mark Meal: POST /api/compliance/meal`);
      console.log(`   - Daily: GET /api/compliance/daily`);
      console.log(`   - Weekly: GET /api/compliance/weekly`);
      console.log(`   - Monthly: GET /api/compliance/monthly`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Conditional server start for Vercel vs Local
if (process.env.VERCEL) {
  // In Vercel, we just connect to DB (async) and export app
  connectDB().catch(err => console.error('Vercel DB Connect Error:', err));
} else {
  // Locally, we connect and listen
  startServer();
}

export default app;
