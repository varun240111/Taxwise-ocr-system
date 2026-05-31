import TaxCalculation from "../models/TaxCalculation.js";
import UserDocument from "../models/UserDocument.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = [];

    const tax = await TaxCalculation.findOne({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const documents = await UserDocument.find({
      userId: req.user.id,
    });

    const uploadedTypes = documents.map((doc) => doc.documentType);

    if (tax) {
      if (Number(tax.gap80C || 0) > 0) {
        notifications.push({
          type: "tax",
          title: "80C Tax Saving Gap",
          message: `You still have ₹${Number(tax.gap80C).toLocaleString("en-IN")} 80C deduction gap.`,
        });
      }

      if (Number(tax.gap80D || 0) > 0) {
        notifications.push({
          type: "tax",
          title: "Health Insurance 80D Gap",
          message: `You can still use ₹${Number(tax.gap80D).toLocaleString("en-IN")} under 80D.`,
        });
      }

      if (Number(tax.gapNPS || 0) > 0) {
        notifications.push({
          type: "tax",
          title: "NPS Saving Available",
          message: `You can still invest ₹${Number(tax.gapNPS).toLocaleString("en-IN")} in NPS.`,
        });
      }

      if (!uploadedTypes.includes("80C")) {
        notifications.push({
          type: "proof",
          title: "80C Proof Missing",
          message: "Upload your 80C investment proof.",
        });
      }

      if (!uploadedTypes.includes("80D")) {
        notifications.push({
          type: "proof",
          title: "80D Proof Missing",
          message: "Upload your health insurance proof.",
        });
      }

      if (!uploadedTypes.includes("NPS")) {
        notifications.push({
          type: "proof",
          title: "NPS Proof Missing",
          message: "Upload your NPS contribution proof.",
        });
      }

      notifications.push({
        type: "report",
        title: "HR Report Ready",
        message: "Your HR tax declaration report is ready to download.",
      });
    }

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};