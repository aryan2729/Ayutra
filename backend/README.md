# Ayutra - Backend API

Backend server for Ayutra authentication and API endpoints.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update the values if needed.

### 3. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ayurdiet.com",
  "password": "admin123",
  "role": "Admin"
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
  "role": "Patient"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

## 🔐 Test Users

The backend comes with pre-configured test users:

### Admin
- **Email:** `admin@ayurdiet.com`
- **Password:** `admin123`
- **Role:** Admin

### Practitioner
- **Email:** `practitioner@ayurdiet.com`
- **Password:** `practitioner123`
- **Role:** Practitioner

### Patient
- **Email:** `patient@ayurdiet.com`
- **Password:** `patient123`
- **Role:** Patient

## 🛠️ Development

### Project Structure

```
backend/
├── server.js          # Main server file
├── routes/
│   └── auth.js        # Authentication routes
├── data/
│   └── users.js       # In-memory user database
├── .env.example       # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

### Adding New Endpoints

1. Create a new route file in `routes/`
2. Import and use it in `server.js`:

```javascript
import { newRoutes } from './routes/new.js';
app.use('/api/new', newRoutes);
```

## 🔒 Security Notes

- **JWT Secrets:** Change the default JWT secrets in production!
- **Password Hashing:** Uses bcryptjs for password hashing
- **CORS:** Configured to allow requests from frontend
- **Token Expiration:** Access tokens expire in 24h, refresh tokens in 30d

## 📝 Environment Variables

- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:4028)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `JWT_EXPIRES_IN` - Access token expiration (default: 24h)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 30d)

## 🗄️ Database

Currently uses an in-memory array for users. In production, replace this with:
- MongoDB
- PostgreSQL
- MySQL
- Or any other database

Update `data/users.js` to use your database connection.

## 🧪 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ayurdiet.com","password":"admin123","role":"Admin"}'
```

## 🤖 Model Integration

This backend integrates with a Python ML service for Ayurvedic diet predictions.

### Model Files Location

Models and dataset are located in the project root `model/` folder:

- `model/ayur_xgb_model.pkl` — Main diet predictor
- `model/prakriti_model.pkl` — Dosha/prakriti predictor  
- `model/AYURDIET_8000_STRONG_AYURVEDA_ALL_FOODS_FIXED.xlsx` — Reference dataset for encoders

### ML Service Setup

1. **Install Python dependencies:**
```bash
cd backend/ml_service
pip install -r requirements.txt
```

2. **Start the Python ML service:**
```bash
cd backend/ml_service
python main.py
# Or with uvicorn:
uvicorn main:app --host 0.0.0.0 --port 8000
```

3. **Configure ML service URL in `.env`:**
```env
ML_SERVICE_URL=http://localhost:8000
```

### Model Endpoints

The Node.js backend proxies requests to the Python ML service:

#### Health Check
```http
GET /api/model/health
```

#### Prediction
```http
POST /api/model/predict
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

#### Diet Plan Generation
```http
POST /api/model/dietplan
Content-Type: application/json

(Same input as /predict)
```

### Input Validation

- **Strict Schema:** Only whitelisted keys are accepted (see `backend/ml_service/config.py`)
- **Required Fields:** `gender`, `age`, `height_cm`, `weight_kg`, `daily_calories`, `diet_type`, `prakriti`
- **Extra Fields:** Automatically rejected (HTTP 400)
- **Contradictions:** Detected and rejected (e.g., `vegan=true` but `vegetarian=false`)

### Clinical Safety

The ML service automatically:
- Checks for diabetes, celiac, CKD, reflux, etc.
- Adds warnings for clinical conditions
- Sanitizes diet plans based on patient conditions
- Filters out unsafe ingredients (gluten for celiac, nuts for allergies, etc.)

### Model Loading

- Models are loaded at Python service startup
- If models contain sklearn pipelines, they're used directly
- Otherwise, encoders/scalers are built from the dataset
- Encoders are persisted in `model/encoders.joblib` for reproducibility

### Response Format

```json
{
  "meta": {
    "model_version": "ayur_xgb_model.pkl",
    "generated_at": "2025-12-08T12:00:00Z"
  },
  "patient": { ...sanitized input... },
  "model_output": {
    "pred_label": "balanced",
    "pred_score": 0.72
  },
  "warnings": ["low GI recommended"],
  "diet_plan": null
}
```

### Testing Model Service

```bash
# Test model loading
python -c "import joblib; joblib.load('../model/ayur_xgb_model.pkl'); print('OK')"

# Test health endpoint
curl http://localhost:8000/api/model/health

# Test prediction
curl -X POST http://localhost:8000/api/model/predict \
  -H "Content-Type: application/json" \
  -d '{"gender":"male","age":35,"height_cm":175,"weight_kg":75,"daily_calories":2000,"diet_type":"vegetarian","prakriti":"Vata-Pitta"}'
```

## 🚨 Production Checklist

- [ ] Change JWT secrets
- [ ] Use environment variables for all secrets
- [ ] Replace in-memory database with real database
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Enable HTTPS
- [ ] Add logging
- [ ] Add error monitoring
- [ ] Set up proper CORS for production domain
- [ ] Configure ML service URL for production
- [ ] Set up model versioning policy
- [ ] Add model health monitoring
