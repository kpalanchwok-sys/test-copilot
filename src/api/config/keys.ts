import dotenv from "dotenv";

dotenv.config();
export type StringValue = `${number}${"d" | "h" | "m" | "s"}`;

export default {
  PORT: process.env.PORT,
  DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  ENV: process.env.ENV,
  SMTP2GO_USER: process.env.SMTP2GO_USER,
  SMTP2GO_API_KEY: process.env.SMTP2GO_API_KEY,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as number | StringValue,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as
    | number
    | StringValue,

  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    PUBLIC_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    REGION: process.env.AWS_REGION,
    URL: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
  },

  ecomm: {
    apiUrl:
      process.env.NODE_ENV === "production"
        ? "https://live.ecomm365.com/acqapi/service.ashx"
        : "https://staging.ecomm365.com/acqapi/service.ashx",
    username: process.env.ECOMM_USERNAME,
    password: process.env.ECOMM_PASSWORD,
  },
};
