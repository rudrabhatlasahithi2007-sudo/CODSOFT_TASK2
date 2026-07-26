import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (connStr) {
      const conn = await mongoose.connect(connStr);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } else {
      console.log('No MONGODB_URI provided. Running with memory-backed database engine for fast sandbox preview.');
      return false;
    }
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}. Falling back to sandbox database storage.`);
    return false;
  }
};

export default connectDB;
