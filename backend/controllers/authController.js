import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AUTH_COOKIE, clearCookieOptions, cookieOptions } from '../config/auth.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });

function sendAuthResponse(res, user, status = 200) {
  const token = generateToken(user._id);
  res.cookie(AUTH_COOKIE, token, cookieOptions());
  return res.status(status).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}

export const register = async (req, res) => {
  try {
    const body = req.body || {};
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
    if (name.length > 100) {
      return res.status(400).json({ message: 'Name is too long (max 100 characters)' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    return sendAuthResponse(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const body = req.body || {};
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!EMAIL_RE.test(email) || !password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      return sendAuthResponse(res, user);
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE, clearCookieOptions());
  return res.json({ message: 'Signed out' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    return res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error('Get me error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
