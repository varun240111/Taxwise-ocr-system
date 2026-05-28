import UserDocument from "../models/UserDocument.js";

import getS3Client from "../utils/s3Client.js"

import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const uploadDocument = async (req, res) => {
  try {

    const s3 = getS3Client();

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const {
      documentType,
      title,
    } = req.body;

    const fileKey =
      `investment-proofs/${req.user.id}/${Date.now()}-${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const fileUrl =
      `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const document =
      await UserDocument.create({

        userId: req.user.id,

        documentType,

        title,

        fileUrl,

        fileKey,

        fileName: file.originalname,

        mimeType: file.mimetype,

        size: file.size,
      });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Document upload failed",
    });
  }
};


export const getUserDocuments = async (req, res) => {
  try {
    const documents = await UserDocument.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.log("GET DOCUMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const s3 = getS3Client();

    const document = await UserDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: document.fileKey,
      })
    );

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.log("DELETE DOCUMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};