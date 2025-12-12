# MongoDB Setup Guide

This guide will help you set up MongoDB for the AyurDiet Pro backend.

## 📋 Prerequisites

- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

## 🚀 Quick Setup

### Option 1: Local MongoDB

1. **Install MongoDB** (if not already installed):
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: `sudo apt-get install mongodb` or follow [MongoDB Linux Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB**:
   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   mongod --config /usr/local/etc/mongod.conf

   # Windows
   net start MongoDB
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster** (free tier is fine)

3. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## ⚙️ Configuration

### 1. Update `.env` file

Add MongoDB connection string to `backend/.env`:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ayurdiet-pro

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ayurdiet-pro?retryWrites=true&w=majority
```

### 2. Environment Variables

Your `.env` file should include:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4028

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ayurdiet-pro

# JWT Secrets
JWT_SECRET=ayurdiet-pro-super-secret-jwt-key-2024-min-32-chars-long
JWT_REFRESH_SECRET=ayurdiet-pro-super-secret-refresh-key-2024-min-32-chars-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d
```

## 🌱 Seed Initial Users

Run the seed script to create test users:

```bash
cd backend
npm run seed
```

This will create:
- **Admin**: `admin@ayurdiet.com` / `admin123`
- **Practitioner**: `practitioner@ayurdiet.com` / `practitioner123`
- **Patient**: `patient@ayurdiet.com` / `patient123`

## 🧪 Test the Connection

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Check the console** - You should see:
   ```
   ✅ MongoDB Connected: localhost:27017
   📊 Database: ayurdiet-pro
   🚀 Server running on http://localhost:3000
   ```

3. **Test the API**:
   ```bash
   # Health check
   curl http://localhost:3000/api/health

   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@ayurdiet.com","password":"admin123","role":"Admin"}'
   ```

## 📊 Database Structure

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  username: String (unique, optional),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['Admin', 'Practitioner', 'Patient']),
  image: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔧 Troubleshooting

### Connection Refused

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
- Make sure MongoDB is running
- Check if port 27017 is correct
- Verify connection string in `.env`

### Authentication Failed

**Error**: `MongoServerError: Authentication failed`

**Solution**:
- Check MongoDB username/password
- Verify connection string format
- For Atlas: Check IP whitelist settings

### Database Not Found

**Error**: Database doesn't exist

**Solution**:
- MongoDB creates databases automatically on first write
- Run the seed script: `npm run seed`

### Port Already in Use

**Error**: `Port 27017 already in use`

**Solution**:
- Find and stop the process using port 27017
- Or change MongoDB port in `mongod.conf`

## 📝 MongoDB Commands

### Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh
# or
mongo

# Switch to database
use ayurdiet-pro

# View collections
show collections

# View users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({ email: "admin@ayurdiet.com" })

# Delete all users (careful!)
db.users.deleteMany({})
```

## 🗄️ Migration from In-Memory to MongoDB

The backend has been updated to use MongoDB instead of in-memory arrays. The migration is automatic:

1. **Old system**: Used `data/users.js` array
2. **New system**: Uses MongoDB with `models/User.js`

All endpoints now work with MongoDB:
- ✅ Login
- ✅ Register
- ✅ Get current user
- ✅ Refresh token
- ✅ Logout

## 🚀 Production Checklist

- [ ] Use MongoDB Atlas or managed MongoDB service
- [ ] Set strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Configure IP whitelist (Atlas)
- [ ] Set up database backups
- [ ] Use connection pooling
- [ ] Add indexes for performance
- [ ] Set up monitoring
- [ ] Use environment-specific connection strings

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)

## ✅ Verification

After setup, verify everything works:

1. ✅ MongoDB connection successful
2. ✅ Seed script runs without errors
3. ✅ Login endpoint works
4. ✅ Users are stored in MongoDB
5. ✅ Can query users from MongoDB shell

If all checks pass, MongoDB integration is complete! 🎉
