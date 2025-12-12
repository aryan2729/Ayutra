import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import User from './models/User.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');
    
    await connectDB();
    
    console.log('\n📊 Testing User model...');
    
    // Try to count users
    const userCount = await User.countDocuments();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Try to find all users
    const users = await User.find().select('email name role').limit(5);
    console.log('\n📝 Sample users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.name} (${user.role})`);
    });
    
    // Try to create a test user
    console.log('\n🧪 Testing user creation...');
    const testUser = await User.create({
      email: `test_${Date.now()}@test.com`,
      password: 'test123',
      name: 'Test User',
      role: 'Patient',
    });
    console.log(`✅ Test user created: ${testUser.email}`);
    
    // Delete test user
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Test user deleted');
    
    console.log('\n✅ All tests passed! MongoDB is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConnection();
