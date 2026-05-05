import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const email = 'shivambca5431@gmail.com';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log("User found:", {
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      });
      
      // If found and not verified, maybe delete it so user can try again?
      // Or just keep it.
    } else {
      console.log("User NOT found");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkUser();
