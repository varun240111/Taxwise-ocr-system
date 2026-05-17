import { TextractClient } from "@aws-sdk/client-textract";

const getTextractClient = () => {

  if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is missing");
  }

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID is missing");
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY is missing");
  }

  return new TextractClient({
    region: process.env.AWS_REGION,

    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

export default getTextractClient;