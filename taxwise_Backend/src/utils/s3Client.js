import { S3Client } from "@aws-sdk/client-s3";

const getS3Client = () => {
  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is missing in .env");
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is missing in .env");
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is missing in .env");
  }

  return new S3Client({
    region: process.env.AWS_REGION.trim(),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
    },
  });
};

export default getS3Client;