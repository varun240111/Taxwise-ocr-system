import { PutObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../utils/s3Client.js";
// import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
// import getTextractClient from "../utils/textractClient.js";
// import { parseSalarySlipText } from "../utils/parseSalarySlip.js";
import {parseSalarySlipTextFromText} from "../utils/parseSalarySlip.js";

import Tesseract from "tesseract.js";
import SalaryRecord from "../models/SalaryRecord.js";

export const uploadSalarySlip = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Salary slip file is required",
      });
    }

    const userId = req.user.id;

    const financialYear =
      req.body.financialYear || "2024-25";

    const fileExtension =
      req.file.originalname.split(".").pop();

    const s3Key =
      `uploads/${userId}/salary-slips/${financialYear}/salary-slip-${Date.now()}.${fileExtension}`;

    // S3 CLIENT

    const s3Client = getS3Client();

    // S3 UPLOAD

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ServerSideEncryption: "AES256",
    });

    await s3Client.send(uploadCommand);

    // TEXTRACT CLIENT

    // const textractClient = getTextractClient();

    // // OCR COMMAND

    // const textractCommand =
    //   new AnalyzeDocumentCommand({

    //     Document: {
    //       S3Object: {
    //         Bucket: process.env.AWS_S3_BUCKET_NAME,
    //         Name: s3Key,
    //       },
    //     },

    //     FeatureTypes: ["FORMS"],
    //   });

    // // OCR RESPONSE

    // const textractResponse =
    //   await textractClient.send(textractCommand);

    // // PARSE TEXT

    // const extractedSalary =
    //   parseSalarySlipText(
    //     textractResponse.Blocks || []
    //   );
    const ocrResult = await Tesseract.recognize(
      req.file.buffer,
      "eng"
    );

    const extractedText =
      ocrResult.data.text;

    console.log(
      "OCR TEXT:",
      extractedText
    );

const extractedSalary =
  parseSalarySlipTextFromText(
    extractedText
  );

    // FINAL RESPONSE

    return res.status(200).json({
      success: true,
      message:
        "Salary slip uploaded and OCR completed",

      s3Key,

      originalFileName:
        req.file.originalname,

      mimetype:
        req.file.mimetype,

      extractedSalary,
    });

  } catch (error) {

    console.log(
      "SALARY OCR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Salary upload or OCR failed",

      error: error.message,
    });

  }

};

export const confirmSalaryData = async (req, res) => {
  try {
    const {
      financialYear,
      basicSalary,
      hra,
      specialAllowance,
      bonus,
      employerPF,
      companyInsurance,
      grossSalary,
      salarySlipS3Key,
      ocrConfidence,
    } = req.body;

    await SalaryRecord.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    const salaryRecord = await SalaryRecord.create({
      userId: req.user.id,
      financialYear,
      basicSalary,
      hra,
      specialAllowance,
      bonus,
      employerPF,
      companyInsurance,
      grossSalary,
      salarySlipS3Key,
      ocrConfidence,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Salary data confirmed and saved",
      salaryRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Salary confirmation failed",
      error: error.message,
    });
  }
};

export const getLatestSalaryRecord = async (req, res) => {
  try {
    const record = await SalaryRecord.findOne({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hasSalaryRecord: !!record,
      record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch salary record",
    });
  }
};

export const getAllSalaryRecords = async (req, res) => {
  try {
    const records = await SalaryRecord.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch salary records",
    });
  }
};

export const getActiveSalaryRecord = async (req, res) => {
  try {
    const record = await SalaryRecord.findOne({
      userId: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hasActiveSalary: !!record,
      record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active salary record",
    });
  }
};

export const markSalaryRecordActive = async (req, res) => {
  try {
    const { id } = req.params;

    await SalaryRecord.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    const activeRecord = await SalaryRecord.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      {
        isActive: true,
      },
      {
        returnDocument: "after",
      }
    );

    if (!activeRecord) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Salary record marked active",
      record: activeRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark active salary record",
      error: error.message,
    });
  }
};