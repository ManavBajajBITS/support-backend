// src/db.js
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/support_ticket_system';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
