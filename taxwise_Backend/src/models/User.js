import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    financialYear: {
      type: String,
      default: "2025-26",
    },

    planType: {
      type: String,
      default: "free",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);