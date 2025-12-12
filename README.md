# Ayutra - AI-Powered Ayurvedic Diet Management System

<div align="center">

![Ayutra Logo](https://img.shields.io/badge/Ayutra-Ayurvedic%20Diet%20Management-blue?style=for-the-badge)

**An intelligent, AI-driven platform for personalized Ayurvedic diet planning, patient management, and compliance tracking**

🌐 **Live Website**: [https://ayutra.vercel.app](https://ayutra.vercel.app)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [API Reference](#-api-reference)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Machine Learning Models](#-machine-learning-models)
- [Authentication & Authorization](#-authentication--authorization)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Ayutra** is a comprehensive healthcare management system that combines traditional Ayurvedic principles with modern machine learning technology. The platform enables healthcare practitioners to create personalized diet plans based on patient constitution (Prakriti), track compliance, and generate insights through advanced analytics.

### Key Capabilities

- **AI-Powered Diet Generation**: Generate personalized Ayurvedic diet plans using XGBoost machine learning models
- **Prakriti Analysis**: Determine patient constitution (Vata, Pitta, Kapha) using ML models
- **Patient Management**: Comprehensive patient profile builder with medical history tracking
- **Compliance Monitoring**: Real-time meal compliance tracking with daily, weekly, and monthly analytics
- **Food Database**: Extensive Ayurvedic food database with dosha compatibility, taste profiles, and nutritional information
- **Progress Analytics**: Visual dashboards with charts and insights for patient progress tracking
- **Role-Based Access**: Multi-role system (Admin, Practitioner, Patient) with granular permissions

---

## ✨ Features

### Core Features

#### 🤖 AI Diet Generator
- Intelligent diet plan generation based on patient constitution
- Customizable preferences (dietary restrictions, budget, seasonal, traditional)
- Clinical safety checks for diabetes, celiac disease, CKD, reflux, etc.
- Automatic ingredient filtering based on patient conditions
- Real-time plan preview and editing

#### 👤 Patient Profile Builder
- Comprehensive patient information collection
- Prakriti (constitution) assessment
- Medical history and condition tracking
- Body measurements and vitals recording
- Dietary preferences and restrictions

#### 📊 Intelligent Dashboard
- Real-time patient overview
- Quick access to key metrics
- Recent activity tracking
- Quick actions for common tasks
- Role-specific views

#### 🍽️ Diet Plan Viewer
- Weekly meal planning interface
- Detailed meal cards with Ayurvedic properties
- Preparation guides and cooking instructions
- Shopping list generation
- Nutritional information display

#### 🔍 Food Explorer
- Searchable Ayurvedic food database
- Filter by dosha, taste, category
- Detailed food properties (Rasa, Guna, Virya, Vipaka)
- Dosha compatibility indicators
- Nutritional breakdown

#### 📈 Progress Analytics
- Compliance tracking (daily, weekly, monthly)
- Visual charts and graphs (D3.js, Recharts)
- Health trend analysis
- Progress reports generation
- Export capabilities (PDF)

#### ✅ Compliance Tracking
- Meal-by-meal compliance marking
- Real-time compliance percentage calculation
- Historical compliance data
- Compliance alerts and reminders

### Advanced Features

- **Dark Mode Support**: Complete theme switching capability
- **Responsive Design**: Mobile-first, fully responsive UI
- **Real-time Updates**: Live data synchronization
- **PDF Export**: Generate and download reports
- **Data Visualization**: Advanced charts and graphs
- **Error Boundaries**: Graceful error handling
- **Protected Routes**: Route-level authentication
- **JWT Authentication**: Secure token-based auth
- **Refresh Tokens**: Automatic token refresh
- **OAuth Support**: Google and Apple login (placeholders)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Vite** | 5.0.0 | Build tool and dev server |
| **React Router** | 6.0.2 | Client-side routing |
| **Redux Toolkit** | 2.6.1 | State management |
| **Tailwind CSS** | 3.4.6 | Utility-first CSS framework |
| **Framer Motion** | 10.16.4 | Animation library |
| **React Hook Form** | 7.55.0 | Form management |
| **Axios** | 1.8.4 | HTTP client |
| **Recharts** | 2.15.2 | Chart library |
| **D3.js** | 7.9.0 | Data visualization |
| **jsPDF** | 3.0.4 | PDF generation |
| **Lucide React** | 0.484.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14.x+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | - | Database |
| **Mongoose** | 9.0.1 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.3.1 | Environment variables |

### Machine Learning Service

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11+ | ML runtime |
| **FastAPI** | 0.104.1 | ML service API |
| **Uvicorn** | 0.24.0 | ASGI server |
| **XGBoost** | 2.0.0+ | ML model framework |
| **scikit-learn** | 1.3.2 | ML utilities |
| **Pandas** | 2.1.3 | Data manipulation |
| **Pydantic** | 2.5.0 | Data validation |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Contexts │  │ Services │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
                        │ JWT Authentication
┌───────────────────────▼─────────────────────────────────────┐
│              Backend API (Node.js/Express)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Patients │  │Compliance│  │  Model   │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬─────┘   │
└───────────────────────┬───────────────────────────┼─────────┘
                        │                           │
                        │                           │ HTTP
            ┌───────────▼──────────┐    ┌──────────▼──────────┐
            │   MongoDB Database   │    │  ML Service (FastAPI)│
            │  ┌────────────────┐  │    │  ┌────────────────┐  │
            │  │    Users       │  │    │  │ XGBoost Models │  │
            │  │   Patients     │  │    │  │  Prakriti      │  │
            │  │  Compliance    │  │    │  │  Diet Plan     │  │
            │  └────────────────┘  │    │  └────────────────┘  │
            └──────────────────────┘    └──────────────────────┘
```

### System Flow

1. **User Authentication**: Frontend authenticates via JWT tokens
2. **Patient Management**: Practitioners create/manage patient profiles
3. **Diet Generation**: ML service generates personalized diet plans
4. **Compliance Tracking**: Patients mark meal compliance
5. **Analytics**: System generates insights and reports

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Recommended Tools

- **VS Code** or any modern IDE
- **MongoDB Compass** - GUI for MongoDB
- **Postman** or **Insomnia** - API testing

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "SIH finals /SIH_Project"
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # If exists, or create manually

# Configure environment variables (see Configuration section)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (if needed)
# Configure environment variables
```

### Step 4: ML Service Setup

```bash
# Navigate to ML service directory
cd ../backend/ml_service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Verify model files exist
ls ../model/
# Should see:
# - ayur_xgb_model.pkl
# - prakriti_model.pkl
# - AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx
```

### Step 5: MongoDB Setup

```bash
# Start MongoDB service
# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# Start MongoDB from Services or use MongoDB Compass

# Verify MongoDB is running
mongosh
# or
mongo
```

See `MONGODB_SETUP.md` for detailed MongoDB configuration.

---

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ayutra
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayutra

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# ML Service URL
ML_SERVICE_URL=http://localhost:8000
```

### Frontend Configuration (`frontend/.env`)

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_ENV=development
```

### ML Service Configuration (`backend/ml_service/.env`)

```env
# Service Configuration
HOST=0.0.0.0
PORT=8000

# Model Paths (relative to ml_service directory)
MODEL_DIR=../model
AYUR_MODEL_PATH=../model/ayur_xgb_model.pkl
PRAKRITI_MODEL_PATH=../model/prakriti_model.pkl
FOOD_DATABASE_PATH=../model/AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx
```

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1: Backend Server

```bash
cd backend
npm run dev  # Auto-reload on changes
# or
npm start    # Standard start
```

Backend will run on: `http://localhost:3000`

#### Terminal 2: ML Service

```bash
cd backend/ml_service
source venv/bin/activate  # Activate virtual environment
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

ML Service will run on: `http://localhost:8000`

#### Terminal 3: Frontend

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:5173` (or port shown in terminal)

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend (Production)

```bash
cd backend
NODE_ENV=production npm start
```

#### Start ML Service (Production)

```bash
cd backend/ml_service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Quick Start Script

You can create a script to start all services at once:

```bash
# Create start-all.sh (macOS/Linux)
#!/bin/bash
# Start MongoDB
brew services start mongodb-community

# Start Backend
cd backend && npm run dev &

# Start ML Service
cd backend/ml_service && source venv/bin/activate && python main.py &

# Start Frontend
cd frontend && npm start
```

---

## 📁 Project Structure

```
SIH_Project/
├── backend/                          # Node.js Backend API
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── data/
│   │   └── users.js                 # User seed data
│   ├── ml_service/                  # Python ML Service
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI application
│   │   ├── config.py                # Configuration
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── model_loader.py          # Model loading logic
│   │   ├── clinical_safety.py      # Safety checks
│   │   ├── requirements.txt         # Python dependencies
│   │   └── venv/                    # Python virtual environment
│   ├── model/                       # ML Model files
│   │   ├── ayur_xgb_model.pkl      # XGBoost diet model
│   │   ├── prakriti_model.pkl      # Prakriti prediction model
│   │   └── AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx
│   ├── models/                      # Mongoose models
│   │   ├── User.js
│   │   ├── Patient.js
│   │   └── MealCompliance.js
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── patient.js               # Patient management
│   │   ├── model.js                 # ML model endpoints
│   │   └── compliance.js            # Compliance tracking
│   ├── scripts/
│   │   └── seedUsers.js             # Database seeding
│   ├── server.js                    # Express server
│   ├── package.json
│   └── .env                         # Environment variables
│
├── frontend/                        # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ui/                  # UI components
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   └── ErrorBoundary.jsx    # Error handling
│   │   ├── contexts/                # React contexts
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Theme management
│   │   ├── pages/                   # Page components
│   │   │   ├── login/               # Login page
│   │   │   ├── intelligent-dashboard/
│   │   │   ├── ai-diet-generator/   # AI diet generation
│   │   │   ├── patient-profile-builder/
│   │   │   ├── diet-plan-viewer/
│   │   │   ├── food-explorer/
│   │   │   ├── progress-analytics/
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Auth hook
│   │   ├── lib/
│   │   │   └── auth.js              # Auth utilities
│   │   ├── styles/                  # Global styles
│   │   ├── App.jsx                  # Root component
│   │   ├── Routes.jsx               # Route configuration
│   │   └── index.jsx                # Entry point
│   ├── package.json
│   ├── vite.config.mjs              # Vite configuration
│   └── tailwind.config.js           # Tailwind configuration
│
├── build/                           # Production build
├── README.md                        # This file
├── BACKEND_SETUP.md                 # Backend setup guide
├── ENDPOINTS.md                     # API endpoints documentation
├── AUTH_SETUP.md                    # Authentication setup
└── MONGODB_SETUP.md                 # MongoDB setup guide
```

---

## 📚 API Documentation

### Base URLs

- **Backend API**: `http://localhost:3000/api`
- **ML Service**: `http://localhost:8000`
- **Frontend**: `http://localhost:5173`

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "Admin" | "Practitioner" | "Client"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "Client"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Patient Endpoints

#### Get All Patients
```http
GET /api/patients
Authorization: Bearer {token}
Query Parameters:
  - page: number
  - limit: number
  - search: string
```

#### Create Patient
```http
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Patient Name",
  "email": "patient@example.com",
  "age": 30,
  "gender": "Male" | "Female" | "Other",
  "constitution": "Vata" | "Pitta" | "Kapha" | "Vata-Pitta" | etc.
}
```

### ML Model Endpoints

#### Health Check
```http
GET /api/model/health
```

#### Generate Diet Plan
```http
POST /api/model/dietplan
Authorization: Bearer {token}
Content-Type: application/json

{
  "gender": "male",
  "age": 35,
  "height_cm": 175,
  "weight_kg": 75,
  "daily_calories": 2000,
  "diet_type": "vegetarian",
  "prakriti": "Vata-Pitta"
}
```

#### Predict Prakriti
```http
POST /api/model/predict
Authorization: Bearer {token}
Content-Type: application/json

{
  "gender": "male",
  "age": 35,
  "height_cm": 175,
  "weight_kg": 75,
  "daily_calories": 2000,
  "diet_type": "vegetarian"
}
```

### Compliance Endpoints

#### Mark Meal Compliance
```http
POST /api/compliance/meal
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "patient_id",
  "mealId": "meal_id",
  "date": "2024-01-15",
  "compliant": true
}
```

#### Get Daily Compliance
```http
GET /api/compliance/daily?patientId={id}&date={date}
Authorization: Bearer {token}
```

#### Get Weekly Compliance
```http
GET /api/compliance/weekly?patientId={id}&week={week}
Authorization: Bearer {token}
```

For complete API documentation, see [ENDPOINTS.md](./ENDPOINTS.md).

---

## 🤖 Machine Learning Models

### Models Overview

The system uses two XGBoost models:

1. **Prakriti Model** (`prakriti_model.pkl`)
   - Predicts patient constitution (Vata, Pitta, Kapha)
   - Input: Patient demographics and physical attributes
   - Output: Prakriti classification

2. **Diet Model** (`ayur_xgb_model.pkl`)
   - Generates personalized diet recommendations
   - Input: Patient data + Prakriti
   - Output: Diet plan with meals and ingredients

### Model Features

- **Clinical Safety Checks**: Automatic filtering of unsafe ingredients
- **Condition-Based Filtering**: Diabetes, celiac, CKD, reflux support
- **Validation**: Input validation and error handling
- **Logging**: Request logging for monitoring

### Model Files

Ensure these files exist in `backend/model/`:
- `ayur_xgb_model.pkl` - Main diet generation model
- `prakriti_model.pkl` - Prakriti prediction model
- `AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx` - Food database

See `backend/ml_service/README.md` for detailed ML service documentation.

---

## 🔐 Authentication & Authorization

### User Roles

1. **Admin**
   - Full system access
   - User management
   - All patient records
   - System configuration

2. **Practitioner**
   - Patient management
   - Diet plan creation
   - Compliance viewing
   - Reports generation
   - Access to AI Diet Generator

3. **Patient/Client**
   - View own profile
   - Mark meal compliance
   - View assigned diet plans
   - Access remedies
   - Cannot access AI Diet Generator

### Authentication Flow

1. User logs in with email/password
2. Backend validates credentials
3. JWT token and refresh token issued
4. Token stored in localStorage (frontend)
5. Token included in API requests
6. Token refreshed automatically when expired

### Protected Routes

- `/intelligent-dashboard` - All authenticated users
- `/ai-diet-generator` - Admin and Practitioner only
- `/patient-records` - Admin and Practitioner only
- `/remedies` - Patients only
- `/reports` - Admin and Practitioner only

## 🚢 Deployment

### 🌐 Live Application

**Production Website**: [https://ayutra.vercel.app](https://ayutra.vercel.app)

The application is currently deployed and accessible at the above URL. You can test all features including:
- User authentication
- Patient profile management
- AI-powered diet generation
- Compliance tracking
- Progress analytics

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Configure environment variables in Vercel dashboard

### Backend Deployment

#### Option 1: Vercel (Serverless)

1. Configure `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Deploy:
```bash
cd backend
vercel
```

#### Option 2: Traditional Server (Node.js)

1. Build and start:
```bash
NODE_ENV=production npm start
```

2. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name ayutra-backend
```

### ML Service Deployment

#### Option 1: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Option 2: Traditional Server

```bash
# Use gunicorn for production
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### MongoDB Deployment

- **MongoDB Atlas** (Recommended for cloud)
- **Self-hosted MongoDB** (For on-premise)

See `MONGODB_SETUP.md` for detailed setup.

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### ML Service Testing

```bash
cd backend/ml_service
source venv/bin/activate
python test_models.py
```

### Manual Testing

1. **Health Checks**:
   - Backend: `http://localhost:3000/api/health`
   - ML Service: `http://localhost:8000/api/model/health`

2. **API Testing**: Use Postman or Insomnia
3. **Frontend Testing**: Use browser DevTools

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- **Issue**: Port 3000 already in use
- **Solution**: Change PORT in `.env` or kill process using port 3000

#### MongoDB connection error
- **Issue**: Cannot connect to MongoDB
- **Solution**: 
  - Verify MongoDB is running: `mongosh`
  - Check `MONGODB_URI` in `.env`
  - Verify network connectivity

#### ML Service errors
- **Issue**: Model files not found
- **Solution**: 
  - Verify model files exist in `backend/model/`
  - Check file paths in `ml_service/config.py`

#### CORS errors
- **Issue**: Frontend cannot access backend
- **Solution**: 
  - Verify `FRONTEND_URL` in backend `.env`
  - Check CORS configuration in `server.js`

#### Authentication fails
- **Issue**: Login returns 401
- **Solution**: 
  - Verify JWT_SECRET in `.env`
  - Check token expiration settings
  - Verify user exists in database

### Getting Help

1. Check existing documentation:
   - `BACKEND_SETUP.md`
   - `AUTH_SETUP.md`
   - `MONGODB_SETUP.md`
   - `backend/ml_service/TROUBLESHOOTING.md`

2. Check logs:
   - Backend: Console output
   - ML Service: Check logs in `ml_service/`
   - Frontend: Browser console

3. Verify environment:
   - All services running
   - Environment variables set
   - Dependencies installed

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

### Code Style

- **JavaScript**: Follow ESLint configuration
- **Python**: Follow PEP 8
- **React**: Use functional components and hooks
- **CSS**: Use Tailwind utility classes

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- Ayurvedic principles and traditional knowledge
- Open-source community and libraries
- Contributors and testers

---

## 📞 Support

For support, please:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics with ML insights
- [ ] Integration with wearable devices
- [ ] Multi-language support
- [ ] Video consultation features
- [ ] Recipe recommendations
- [ ] Social features for patient communities

---

<div align="center">

**Built with ❤️ for better healthcare**

[Back to Top](#-ayutra---ai-powered-ayurvedic-diet-management-system)

</div>
