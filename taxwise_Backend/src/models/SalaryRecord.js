import mongoose from "mongoose";

const salaryRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    financialYear: {
      type: String,
      required: true,
    },

    basicSalary: Number,
    hra: Number,
    specialAllowance: Number,
    bonus: Number,
    employerPF: Number,
    companyInsurance: Number,
    grossSalary: Number,

    salarySlipS3Key: String,
    ocrConfidence: Number,

    status: {
      type: String,
      default: "confirmed",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SalaryRecord", salaryRecordSchema);