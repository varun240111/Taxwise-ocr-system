import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {

  try {

    let token;

    const authHeader =
      req.headers.authorization;

    
    // Check Authorization Header
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }


    // Extract Token
    token = authHeader.split(" ")[1];


    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );


    // Find User
    const user = await User.findById(
      decoded.userId
    ).select(
      "-password -otp -otpExpires -refreshToken"
    );


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }


    // Attach User to Request
    req.user = user;


    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
      error: error.message,
    });
  }
};

export default protect;