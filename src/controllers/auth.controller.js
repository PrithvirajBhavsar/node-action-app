const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  revokeToken,
} = require('../middleware/auth');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateSignupPayload = ({ name, email, password }) => {
  if (!name || !String(name).trim()) {
    return 'Name is required';
  }

  if (!email || !validateEmail(String(email).trim())) {
    return 'A valid email is required';
  }

  if (!password || String(password).trim().length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
};

const validateLoginPayload = ({ email, password }) => {
  if (!email || !validateEmail(String(email).trim())) {
    return 'A valid email is required';
  }

  if (!password || String(password).trim().length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return null;
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validateSignupPayload({ name, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: String(Date.now()),
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLoginPayload({ email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      verifyToken(token, 'access');
      revokeToken(token);
    } catch (error) {
      // ignore expired or invalid token and still return a successful logout response
    }
  }

  return res.json({ message: 'Logout successful' });
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken, 'refresh');
    const user = await User.findOne({ id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: 'User not found for refresh token' });
    }

    const accessToken = generateAccessToken(user);
    const nextRefreshToken = generateRefreshToken(user);

    return res.json({
      message: 'Token refreshed successfully',
      accessToken,
      refreshToken: nextRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  refresh,
};
