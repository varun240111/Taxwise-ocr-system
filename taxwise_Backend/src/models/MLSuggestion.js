import mongoose from "mongoose";

const mlSuggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    calculationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxCalculation",
      required: true,
    },

    suggest80C: {
      type: Boolean,
      default: false,
    },

    suggest80D: {
      type: Boolean,
      default: false,
    },

    suggestNPS: {
      type: Boolean,
      default: false,
    },

    best80CInstrument: {
      type: String,
      default: "",
    },

    regimeRecommendation: {
      type: String,
      default: "",
    },

    confidenceScore: {
      type: Number,
      default: 0.85,
    },

    priorityOrder: {
      type: [String],
      default: [],
    },
    saving80C: {
      type: Number,
      default: 0,
    },

    saving80D: {
      type: Number,
      default: 0,
    },

    savingNPS: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      enum: ["helpful", "not_helpful", "pending"],
      default: "pending",
    },

  },
  { timestamps: true }
);

export default mongoose.model("MLSuggestion", mlSuggestionSchema);