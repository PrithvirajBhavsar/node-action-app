const mongoose = require('mongoose');

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
  mongoose.connection._lastError = error;
});

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGODB_URI is not defined in the .env file');
    mongoose.connection._lastError = new Error('MONGODB_URI is not defined in the .env file');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    mongoose.connection._lastError = null;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    mongoose.connection._lastError = error;
  }
};

module.exports = connectDB;

