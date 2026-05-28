import MLSuggestion from "../models/MLSuggestion.js";

export const getLatestSuggestion = async (req, res) => {
  try {
    const suggestion = await MLSuggestion.findOne({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    if (!suggestion) {
        return res.status(200).json({
        success: true,
        hasSuggestion: false,
        suggestion: null,
      });
    }

    return res.status(200).json({
      success: true,
      hasSuggestion: true,
      suggestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggestion",
      error: error.message,
    });
  }
};