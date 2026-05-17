import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: String,
    password: String,
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("PendingUser", pendingUserSchema);