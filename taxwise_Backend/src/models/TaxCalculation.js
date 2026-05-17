import mongoose from "mongoose";

const taxCalculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    salaryRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryRecord",
      required: true,
    },

    financialYear: {
      type: String,
      required: true,
    },

    hraExemption: {
      type: Number,
      default: 0,
    },

    taxOldRegime: {
      type: Number,
      default: 0,
    },

    taxNewRegime: {
      type: Number,
      default: 0,
    },

    taxableIncomeOld: {
      type: Number,
      default: 0,
    },

    taxableIncomeNew: {
      type: Number,
      default: 0,
    },

    gap80C: {
      type: Number,
      default: 0,
    },

    gap80D: {
      type: Number,
      default: 0,
    },

    gapNPS: {
      type: Number,
      default: 0,
    },

    potentialSaving: {
      type: Number,
      default: 0,
    },

    betterRegime: {
      type: String,
      enum: ["old", "new", "same"],
      default: "same",
    },

    rawResult: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("TaxCalculation", taxCalculationSchema);

