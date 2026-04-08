import AWS from "aws-sdk";
import { Request, Response } from "express";
import config from "../config";
import { resourceParamSchema } from "../shared/schema/zgetPresignedUrlsSchema";
import { confirmUploadFileSchema } from "../shared/schema/zUploadFilesSchema";
import { modelRegistry } from "./awsModelRegistry";
import { sendErrorResponse, sendSuccessResponse } from "./responseHandler";

export const s3 = new AWS.S3({
  signatureVersion: "v4",
});


export const confirmUpload = async (req: Request, res: Response) => {
  const {
    images = [],
    documents = [],
    videos = [],
  } = confirmUploadFileSchema.parse(req.body);
  const normalizedParams = {
    ...req.params,
    resource: (req.params.resource as string).toLowerCase(),
  };
  const { resource, id } = resourceParamSchema.parse(normalizedParams);

  const Model = modelRegistry[resource as keyof typeof modelRegistry];

  const entity = await Model.findById(id);

  if (!entity) {
    return sendErrorResponse({
      res,
      message: `${resource} not found`,
      code: 404,
    });
  }

  if (images.length > 0 && Array.isArray(entity.images)) {
    entity.images = entity.images.map((img: any) => {
      const match = images.find((i) => i === img._id.toString());

      return match ? { ...img.toObject?.(), status: "Done" } : img;
    });
  }

  if (documents.length > 0 && Array.isArray(entity.documents)) {
    entity.documents = entity.documents.map((doc: any) => {
      const match = documents.find((d) => d === doc._id.toString());

      return match ? { ...doc.toObject?.(), status: "Done" } : doc;
    });
  }
  if (videos.length > 0 && Array.isArray(entity.videos)) {
    entity.videos = entity.videos.map((vdo: any) => {
      const match = videos.find((d) => d === vdo._id.toString());

      return match ? { ...vdo.toObject?.(), status: "Done" } : vdo;
    });
  }

  await entity.save();

  return sendSuccessResponse({
    res,
    message: "Upload confirmed successfully",
    data: {
      [formatResourceKey(resource)]: id,
    },
  });
};

export const getObjectFromS3 = async (key: string) => {
  const params = {
    Bucket: "rentisity-stage",
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    if (!data.Body) {
      throw new Error(`S3 object body is empty for key: ${key}`);
    }
    return data.Body.toString("utf-8");
  } catch (err) {
    console.error("Error retrieving object from S3:", err);
    throw err;
  }
};

export const uploadImageToS3 = async (
  imageBuffer: Buffer,
  fileName: string,
  contentType: string,
) => {
  const bucketName = config.AWS.PUBLIC_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Bucket name is missing from configuration");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: imageBuffer,
    ContentType: contentType,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
};

export const formatResourceKey = (resource: string) => {
  let key = resource.endsWith("s") ? resource.slice(0, -1) : resource;
  key = key.charAt(0).toLowerCase() + key.slice(1);

  return `${key}Id`;
};
