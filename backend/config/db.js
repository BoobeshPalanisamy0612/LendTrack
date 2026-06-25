const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Mongo URI loaded:', !!process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('FULL ERROR:');
    console.error(error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;