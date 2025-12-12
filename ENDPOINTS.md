# AyurDiet Pro - API Endpoints Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: [Your Production URL]/api
```

## Frontend Routes

### Public Routes
- `GET /` - Login page
- `GET /login` - Login page

### Protected Routes (Require Authentication)
- `GET /intelligent-dashboard` - Main dashboard
- `GET /diet-plan-viewer` - View diet plans
- `GET /patient-profile-builder` - Build patient profiles
- `GET /food-explorer` - Explore foods database
- `GET /progress-analytics` - View analytics and progress
- `GET /ai-diet-generator` - Generate AI diet plans

---

## Backend API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "Admin" | "Practitioner" | "Client"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "Admin",
      "name": "User Name"
    }
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "Client"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
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

Request Body:
{
  "refreshToken": "refresh_token_here"
}
```

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

Request Body:
{
  "token": "google_oauth_token"
}
```

#### Apple OAuth Login
```http
POST /api/auth/apple
Content-Type: application/json

Request Body:
{
  "token": "apple_oauth_token"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

Request Body:
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```

---

### Patient Endpoints

#### Get All Patients
```http
GET /api/patients
Authorization: Bearer {token}
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - role: string
```

#### Get Patient by ID
```http
GET /api/patients/:id
Authorization: Bearer {token}
```

#### Create Patient
```http
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Patient Name",
  "email": "patient@example.com",
  "age": 30,
  "gender": "Male" | "Female" | "Other",
  "constitution": "Vata" | "Pitta" | "Kapha" | "Vata-Pitta" | etc.
}
```

#### Update Patient
```http
PUT /api/patients/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "name": "Updated Name",
  // ... other fields
}
```

#### Delete Patient
```http
DELETE /api/patients/:id
Authorization: Bearer {token}
```

#### Get Patient Constitution
```http
GET /api/patients/:id/constitution
Authorization: Bearer {token}
```

---

### Diet Plan Endpoints

#### Get All Diet Plans
```http
GET /api/diet-plans
Authorization: Bearer {token}
Query Parameters:
  - patientId: string
  - page: number
  - limit: number
```

#### Get Diet Plan by ID
```http
GET /api/diet-plans/:id
Authorization: Bearer {token}
```

#### Create Diet Plan
```http
POST /api/diet-plans
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "patientId": "patient_id",
  "name": "Plan Name",
  "duration": 7,
  "meals": [...],
  "preferences": {...}
}
```

#### Update Diet Plan
```http
PUT /api/diet-plans/:id
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Diet Plan
```http
DELETE /api/diet-plans/:id
Authorization: Bearer {token}
```

#### Generate AI Diet Plan
```http
POST /api/diet-plans/generate
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "patientId": "patient_id",
  "preferences": {
    "dietaryRestrictions": ["vegetarian"],
    "budget": "low",
    "seasonal": true,
    "traditional": true
  }
}
```

---

### Food Endpoints

#### Get All Foods
```http
GET /api/foods
Authorization: Bearer {token}
Query Parameters:
  - category: string
  - dosha: string
  - taste: string
  - page: number
  - limit: number
```

#### Get Food by ID
```http
GET /api/foods/:id
Authorization: Bearer {token}
```

#### Search Foods
```http
GET /api/foods/search
Authorization: Bearer {token}
Query Parameters:
  - q: string (search query)
  - category: string
  - dosha: string
  - taste: string
```

---

### Analytics Endpoints

#### Get Patient Progress
```http
GET /api/analytics/patients/:patientId/progress
Authorization: Bearer {token}
Query Parameters:
  - startDate: string (ISO date)
  - endDate: string (ISO date)
```

#### Get Compliance Metrics
```http
GET /api/analytics/patients/:patientId/compliance
Authorization: Bearer {token}
```

#### Get Health Insights
```http
GET /api/analytics/patients/:patientId/insights
Authorization: Bearer {token}
```

---

## Error Responses

All endpoints may return the following error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```http
Authorization: Bearer {jwt_token}
```

Tokens are obtained through the login endpoint and should be stored securely (e.g., in localStorage or httpOnly cookies).

---

## Development Server

The frontend development server runs on:
```
http://localhost:4028
```

To start the development server:
```bash
npm start
```
