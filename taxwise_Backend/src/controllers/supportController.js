import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const createSupportTicket = async (req, res) => {
  try {
    const { category, priority, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const user = await User.findById(req.user.id);

    const ticket = await SupportTicket.create({
      userId: req.user.id,
      name: user.name,
      email: user.email,
      category,
      priority,
      subject,
      message,
    });

    await sendEmail({
      to: process.env.SUPPORT_EMAIL,
      subject: `New Support Ticket - ${subject}`,
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>New TaxWise Vault Support Ticket</h2>
          <p><b>Ticket ID:</b> ${ticket._id}</p>
          <p><b>Name:</b> ${user.name}</p>
          <p><b>Email:</b> ${user.email}</p>
          <p><b>Category:</b> ${category}</p>
          <p><b>Priority:</b> ${priority}</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.log("SUPPORT TICKET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
    });
  }
};

export const getMySupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};