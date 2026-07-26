import User from '../models/User.js';
import { initialUsers } from '../utils/seedData.js';
import bcrypt from 'bcryptjs';

// In-memory user store initialized with seed data
let usersStore = [...initialUsers];

export const getAllUsers = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const users = await User.find({}).select('-password');
      if (users && users.length > 0) return users;
    }
  } catch (err) {
    console.warn('DB query fallback to store:', err.message);
  }
  return usersStore.map(({ password, ...u }) => u);
};

export const findUserById = async (id) => {
  try {
    if (process.env.MONGODB_URI) {
      const user = await User.findById(id).select('-password');
      if (user) return user;
    }
  } catch (err) {
    // fallback
  }
  const u = usersStore.find(user => user._id === id);
  if (u) {
    const { password, ...rest } = u;
    return rest;
  }
  return null;
};

export const findUserByEmail = async (email) => {
  try {
    if (process.env.MONGODB_URI) {
      const user = await User.findOne({ email });
      if (user) return user;
    }
  } catch (err) {
    // fallback
  }
  return usersStore.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const createUser = async (userData) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(userData.password, salt);

  try {
    if (process.env.MONGODB_URI) {
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      return user;
    }
  } catch (err) {
    console.warn('Mongoose create fallback:', err.message);
  }

  const newUser = {
    _id: `usr_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'Developer',
    avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    department: userData.department || 'Engineering',
    bio: userData.bio || '',
    skills: userData.skills || [],
    createdAt: new Date().toISOString()
  };

  usersStore.push(newUser);
  const { password, ...rest } = newUser;
  return rest;
};

export const updateUser = async (id, updateData) => {
  try {
    if (process.env.MONGODB_URI) {
      const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (updated) return updated;
    }
  } catch (err) {
    // fallback
  }

  const index = usersStore.findIndex(u => u._id === id);
  if (index !== -1) {
    usersStore[index] = { ...usersStore[index], ...updateData };
    const { password, ...rest } = usersStore[index];
    return rest;
  }
  return null;
};
