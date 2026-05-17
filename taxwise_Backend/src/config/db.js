// Database Config : How Project connects and start

import mongoose from "mongoose";
const connectDB= async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected:`); // ${conn.connection.host}
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectDB;