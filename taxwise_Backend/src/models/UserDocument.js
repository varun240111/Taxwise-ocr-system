import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      required: true,
      enum: [
        "80C",
        "80D",
        "NPS",
        "RENT_RECEIPT",
        "HOME_LOAN",
        "EDUCATION_LOAN",
        "DONATION",
        "OTHER",
      ],
    },

    title: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileKey: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
    },

    mimeType: {
      type: String,
    },

    size: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["uploaded", "verified", "rejected"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserDocument", userDocumentSchema);