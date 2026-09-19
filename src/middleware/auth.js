const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '10m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const revokedTokens = new Set();

const isTokenRevoked = (token) => revokedTokens.has(token);

const revokeToken = (token) => {
  if (token) {
    revokedTokens.add(token);
  }
};

const generateAccessToken = (user) => jwt.sign(
  {
    id: user.id,
    email: user.email,
    name: user.name,
    type: 'access',
  },
  JWT_SECRET,
  { expiresIn: JWT_ACCESS_EXPIRY }
);

const generateRefreshToken = (user) => jwt.sign(
  {
    id: user.id,
    email: user.email,
    type: 'refresh',
  },
  JWT_SECRET,
  { expiresIn: JWT_REFRESH_EXPIRY }
);

const verifyToken = (token, expectedType) => {
  if (!token) {
    throw new Error('Token is missing');
  }

  if (isTokenRevoked(token)) {
    throw new Error('Token has been revoked');
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded.type !== expectedType) {
    throw new Error('Token type mismatch');
  }

  return decoded;
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token, 'access');
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Access token expired or invalid' });
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  verifyToken,
  revokeToken,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
};
