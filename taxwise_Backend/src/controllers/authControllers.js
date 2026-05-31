// It handles user requests and performs actions.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import PendingUser from "../models/PendingUser.js";
import getS3Client from "../utils/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";


// ================= ACCESS TOKEN =================
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRE || "15m",
    } 
  );
};


// ================= REFRESH TOKEN =================
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        process.env.REFRESH_TOKEN_EXPIRE || "7d",
    }
  );
};


// ================= SET REFRESH TOKEN COOKIE =================
const setRefreshTokenCookie = (
  res,
  refreshToken
) => {
  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    }
  );
};


// ================= GENERATE OTP =================
const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

export const updateAccountProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { name, phone } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (req.file) {
      const s3 = getS3Client();

      const fileKey = `profile-images/${req.user.id}/${Date.now()}-${req.file.originalname}`;

      await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

      user.profileImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      user.profileImageKey = fileKey;
    }

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};
export const updateNotifications = async (req, res) => {
  try {
    const { notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notifications },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Notifications updated successfully",
      notifications: user.notifications,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = generateOtp();

    const otpExpires = Date.now() + 10 * 60 * 1000;

    await PendingUser.findOneAndDelete({
      $or: [{ email }, { phone }],
    });

    const pendingUser = await PendingUser.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await sendEmail({
      to: email,
      subject: "Your TaxWise Vault OTP",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>TaxWise Vault Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully. Please verify OTP.",
      pendingUserId: pendingUser._id,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};



// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const pendingUser = await PendingUser.findById(userId);

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "Signup session expired. Please signup again.",
      });
    }

    if (pendingUser.otp !== otp || pendingUser.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone,
      password: pendingUser.password,
      isVerified: true,
    });

    await PendingUser.findByIdAndDelete(pendingUser._id);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};



// ================= LOGIN USER =================
export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // Find User
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    // Compare Password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    // Check Verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify OTP first",

        userId: user._id,
      });
    }


    // Generate Tokens
    const accessToken =
      generateAccessToken(user._id);

    const refreshToken =
      generateRefreshToken(user._id);


    // Save Refresh Token
    user.refreshToken =
      refreshToken;

    await user.save();


    // Set Cookie
    setRefreshTokenCookie(
      res,
      refreshToken
    );


    // Response
    res.status(200).json({
      success: true,

      message:
        "Login successful",

      token: accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Refresh Controller

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Password update failed",
    });
  }
};