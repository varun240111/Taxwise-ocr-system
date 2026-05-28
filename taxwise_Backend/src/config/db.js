
import mongoose from "mongoose";
import dns from "node:dns"; // 1. Import Node's built-in DNS module


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:`); // ${conn.connection.host} 
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
}

export default connectDB;