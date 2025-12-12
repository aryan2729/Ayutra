import bcrypt from 'bcryptjs';

// In-memory user database
// In production, replace this with a real database (MongoDB, PostgreSQL, etc.)
export const users = [
  {
    id: 'admin_1',
    email: 'admin@ayurdiet.com',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10), // password: admin123
    name: 'Admin User',
    role: 'Admin',
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'practitioner_1',
    email: 'practitioner@ayurdiet.com',
    username: 'practitioner',
    password: bcrypt.hashSync('practitioner123', 10), // password: practitioner123
    name: 'Dr. Ayurveda Practitioner',
    role: 'Practitioner',
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'patient_1',
    email: 'patient@ayurdiet.com',
    username: 'patient',
    password: bcrypt.hashSync('patient123', 10), // password: patient123
    name: 'John Doe',
    role: 'Patient',
    image: null,
    createdAt: new Date().toISOString()
  }
];

// Helper function to add a user (for registration)
export function addUser(userData) {
  const newUser = {
    id: `user_${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
}

// Helper function to find user by email
export function findUserByEmail(email) {
  return users.find(u => u.email === email || u.username === email);
}

// Helper function to find user by ID
export function findUserById(id) {
  return users.find(u => u.id === id);
}
