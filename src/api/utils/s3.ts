import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { AppError } from "./AppError";

export const s3 = new AWS.S3({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.ACCESS_KEY,
  region: config.AWS.REGION,
});

export type PresignedPutInput = {
  fileName?: string;
  contentType?: string;
  pathPrefix?: string; // e.g. "boat/123/images"
  expiresInSeconds?: number;
};

export type PresignedPutResult = {
  key: string;
  uploadUrl: string;
  fileUrl: string;
  contentType: string;
};

export type PresignedGetInput = {
  key: string;
  expiresInSeconds?: number;
};

type UploadInputFile = {
  fileName?: string;
  contentType?: string;
};

export const getS3PresignedPutUrl = async (
  input: PresignedPutInput,
): Promise<PresignedPutResult> => {
  const bucket = config.AWS.PUBLIC_BUCKET_NAME;
  if (!bucket) throw new Error("PUBLIC_BUCKET_NAME is missing");

  const contentType = input.contentType || "application/octet-stream";
  const expiresInSeconds = input.expiresInSeconds ?? 120;

  const key =
    input.fileName ||
    `${input.pathPrefix ? `${input.pathPrefix}/` : ""}${uuidv4()}`;

  const sanitizedKey = key.replace(/[^a-zA-Z0-9._\-\/]/g, "_");

  const uploadUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: bucket,
    Key: sanitizedKey,
    Expires: expiresInSeconds,
    ContentType: contentType,
    ACL: "public-read",
  });

  const fileUrl = `https://${bucket}.s3.${config.AWS.REGION}.amazonaws.com/${sanitizedKey}`;

  return { key: sanitizedKey, uploadUrl, fileUrl, contentType };
};

export const getManyS3PresignedPutUrls = async (
  files: Array<{ fileName?: string; contentType?: string }>,
  opts?: { pathPrefix?: string; expiresInSeconds?: number },
) => {
  return Promise.all(
    files.map((f) =>
      getS3PresignedPutUrl({
        fileName: f.fileName,
        contentType: f.contentType,
        pathPrefix: opts?.pathPrefix,
        expiresInSeconds: opts?.expiresInSeconds,
      }),
    ),
  );
};

export const buildUploadPlan = async (
  files: UploadInputFile[],
  pathPrefix: string,
) => {
  const signed = await getManyS3PresignedPutUrls(files, {
    pathPrefix,
    expiresInSeconds: 120,
  });

  const result = signed.map((s, index) => ({
    fileName: files[index]?.fileName || s.key.split("/").pop() || s.key,
    uploadUrl: s.uploadUrl,
    fileUrl: s.fileUrl,
    key: s.key,
    contentType: s.contentType,
  }));

  const dbFiles = result.map((item) => ({
    fileName: item.fileName,
    fileUrl: item.fileUrl, // permanent URL (not signed URL)
    contentType: item.contentType,
    status: "pending",
  }));

  return { result, dbFiles };
};

AWS.config.update({
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.ACCESS_KEY,
  region: config.AWS.REGION,
});

const bucket = config.AWS.PUBLIC_BUCKET_NAME as string;

export const uploadImageToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> => {
  try {
    const data = await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
      })
      .promise();

    return data.Location;
  } catch (err) {
    console.error(err);
    throw new AppError(500, "S3 upload failed");
  }
};
