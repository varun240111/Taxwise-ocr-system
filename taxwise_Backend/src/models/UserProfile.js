import mongoose from "mongoose";

const lifeEventSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      enum: [
        "married",
        "child_birth",
        "home_loan",
        "parent_senior_citizen",
        "job_change",
      ],
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    cityType: {
      type: String,
      enum: ["metro", "non-metro"],
      required: true,
    },

    riskAppetite: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    yearsToRetirement: {
      type: Number,
      required: true,
    },

    taxScore: {
      type: Number,
      default: 0,
    },

    lifeEvents: {
      type: [lifeEventSchema],
      default: [],
    },
      rentPaid: {
        type: Number,
        default: 0,
      },

      cityOfResidence: {
        type: String,
        default: "",
      },

      landlordName: {
        type: String,
        default: "",
      },

      hasHomeLoan: {
        type: Boolean,
        default: false,
      },

      homeLoanInterest: {
        type: Number,
        default: 0,
      },

      hasEducationLoan: {
        type: Boolean,
        default: false,
      },

      educationLoanInterest: {
        type: Number,
        default: 0,
      },

      existing80C: {
        type: Number,
        default: 0,
      },

      existing80D: {
        type: Number,
        default: 0,
      },

      existingNPS: {
        type: Number,
        default: 0,
      },

      existing80G: {
        type: Number,
        default: 0,
      },
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);