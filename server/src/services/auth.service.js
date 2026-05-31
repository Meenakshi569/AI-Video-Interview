import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../middleware/error.middleware.js';

const VALID_ROLES = ['candidate', 'recruiter'];

function buildAuthResponse(user) {
  const token = signToken({ id: user._id, role: user.role });
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register({ name, email, password, role = 'candidate' }) {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError('Name, email, and password are required');
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters');
  }

  const normalizedRole = role || 'candidate';
  if (!VALID_ROLES.includes(normalizedRole)) {
    throw new AppError('Role must be candidate or recruiter');
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: normalizedRole,
  });

  return buildAuthResponse(user);
}

export async function login({ email, password }) {
  if (!email?.trim() || !password) {
    throw new AppError('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return buildAuthResponse(user);
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
