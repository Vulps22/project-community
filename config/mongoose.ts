import mongoose from 'mongoose';
import User from '../src/models/user';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/project-communicate';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully');
        
        require('./models');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
