import UserProfile from "../models/UserProfile.js";
import TaxCalculation from "../models/TaxCalculation.js";
import MLSuggestion from "../models/MLSuggestion.js";


export const setupProfile = async (req, res) => {
  try {
    const {
      fullName,
      age,
      city,
      cityType,
      riskAppetite,
      lifeEvents,
    } = req.body;

    const existingProfile = await UserProfile.findOne({
      userId: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const yearsToRetirement = 60 - Number(age);

    const profile = await UserProfile.create({
      userId: req.user.id,
      fullName,
      age,
      city,
      cityType,
      riskAppetite,
      yearsToRetirement,

      // IMPORTANT
      lifeEvents: lifeEvents || [],
    });

    res.status(201).json({
      success: true,
      message: "Profile setup completed",
      profile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile setup failed",
      error: error.message,
    });
  }
};

export const checkProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      profileExists: !!profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile check failed",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      age,
      city,
      cityType,
      riskAppetite,
      lifeEvents,
    } = req.body;

    const existingProfile = await UserProfile.findOne({
      userId,
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (fullName !== undefined) existingProfile.fullName = fullName;
    if (age !== undefined) existingProfile.age = Number(age);
    if (city !== undefined) existingProfile.city = city;
    if (cityType !== undefined) existingProfile.cityType = cityType;
    if (riskAppetite !== undefined) existingProfile.riskAppetite = riskAppetite;
    if (lifeEvents !== undefined) existingProfile.lifeEvents = lifeEvents;

    if (age !== undefined) {
      existingProfile.yearsToRetirement = 60 - Number(age);
    }

    await existingProfile.save();
    await TaxCalculation.deleteMany({
      userId: req.user.id,
    });

    await MLSuggestion.deleteMany({
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: existingProfile,
    });
  } catch (error) {
    console.log("PROFILE UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};


export const updateTaxDetails =
  async (req, res) => {

    try {

      const updatedProfile =
        await UserProfile.findOneAndUpdate(

          {
            userId: req.user.id,
          },

          {
            rentPaid:
              req.body.rentPaid,

            cityOfResidence:
              req.body.cityOfResidence,

            landlordName:
              req.body.landlordName,

            hasHomeLoan:
              req.body.hasHomeLoan,

            homeLoanInterest:
              req.body.homeLoanInterest,

            hasEducationLoan:
              req.body.hasEducationLoan,

            educationLoanInterest:
              req.body.educationLoanInterest,

            existing80C:
              req.body.existing80C,

            existing80D:
              req.body.existing80D,

            existingNPS:
              req.body.existingNPS,

            existing80G:
              req.body.existing80G,
          },

          {
            returnDocument: "after",
            runValidators: true,
          }
        );
        await TaxCalculation.deleteMany({
          userId: req.user.id,
        });

        await MLSuggestion.deleteMany({
          userId: req.user.id,
        });
        return res.status(200).json({
          success: true,
          profile: updatedProfile,
        });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Failed to update tax details",
      });
    }
};