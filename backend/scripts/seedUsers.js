import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const seedUsers = [
  {
    email: 'admin@ayurdiet.com',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
    isActive: true,
  },
  {
    email: 'practitioner@ayurdiet.com',
    username: 'practitioner',
    password: 'practitioner123',
    name: 'Dr. Ayurveda Practitioner',
    role: 'Practitioner',
    isActive: true,
  },
  {
    email: 'patient@ayurdiet.com',
    username: 'patient',
    password: 'patient123',
    name: 'John Doe',
    role: 'Patient',
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    console.log('🌱 Seeding users...');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    let created = 0;
    let skipped = 0;

    for (const userData of seedUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`⏭️  User ${userData.email} already exists, skipping...`);
          skipped++;
          continue;
        }

        // Create user (password will be hashed automatically)
        const user = await User.create(userData);
        console.log(`✅ Created user: ${user.email} (${user.role})`);
        created++;
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${seedUsers.length}`);

    console.log('\n✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

// Run seed function
seedDatabase();
