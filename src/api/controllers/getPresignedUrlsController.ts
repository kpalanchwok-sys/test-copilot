import { Request, Response } from "express";
import mongoose from "mongoose";
import { resourceParamSchema } from "../shared/schema/zgetPresignedUrlsSchema";
import { uploadFileSchema } from "../shared/schema/zUploadFilesSchema";
import { AppError } from "../utils/AppError";
import { modelRegistry } from "../utils/awsModelRegistry";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";
import { buildUploadPlan } from "../utils/s3";
import { formatResourceKey } from "../utils/uploadToS3";

export interface FileData {
  fileName: string;
  uploadUrl: string;
  fileUrl: string;
  key: string;
  contentType: string;
  _id: string;
}
[];

export interface UploadResult {
  resource: string;
  id: string;
  images: FileData[];
  documents: FileData[];
  videos: FileData[];
}

type MediaType = "images" | "documents" | "videos";

const MEDIA_TYPES: MediaType[] = ["images", "documents", "videos"];

const mergeWithIds = (
  savedItems: any[],
  presignedResults: any[],
): FileData[] => {
  return savedItems.reduce<FileData[]>((acc, item) => {
    const match = presignedResults.find((r) => r.fileName === item.fileName);
    if (match) {
      acc.push({ ...match, _id: item._id.toString() });
    }
    return acc;
  }, []);
};

export const getPresignedUrlsController = catchAsync(
  async (req: Request, res: Response) => {
    const normalizedParams = {
      ...req.params,
      resource: (req.params.resource as string).toLowerCase(),
    };
    console.log("🚀 ~ normalizedParams:", normalizedParams);

    const { resource, id } = resourceParamSchema.parse(normalizedParams);

    const {
      images = [],
      documents = [],
      videos = [],
    } = uploadFileSchema.parse(req.body);

    const Model = modelRegistry[resource];
    console.log("🚀 ~ Model:", Model);
    if (!Model) {
      throw new AppError(404, `Resource '${resource}' not found`);
    }

    const entity = await Model.findById(id).orFail(
      new AppError(404, `${resource} with id '${id}' not found`),
    );

    const basePath = `${resource}/${id}`;
    const [imagesResult, documentsResult, videosResult] = await Promise.all([
      buildUploadPlan(images, `${basePath}/images`),
      buildUploadPlan(documents, `${basePath}/documents`),
      buildUploadPlan(videos, `${basePath}/videos`),
    ]);

    MEDIA_TYPES.forEach((type) => {
      if (!Array.isArray(entity[type])) entity[type] = [];
    });

    entity.images.push(...imagesResult.dbFiles);
    entity.documents.push(...documentsResult.dbFiles);
    entity.videos.push(...videosResult.dbFiles);

    const saved = await entity.save();

    const response: UploadResult = {
      resource,
      id,
      images: mergeWithIds(saved.images, imagesResult.result),
      documents: mergeWithIds(saved.documents, documentsResult.result),
      videos: mergeWithIds(saved.videos, videosResult.result),
    };

    return res.status(200).json(response);
  },
);

export const deleteFiles = catchAsync(async (req: Request, res: Response) => {
  const normalizedParams = {
    ...req.params,
    resource: (req.params.resource as string).toLowerCase(),
  };

  const { resource, id } = resourceParamSchema.parse(normalizedParams);

  const { imageIds = [], documentIds = [], videoIds = [] } = req.body;

  if (
    imageIds.length === 0 &&
    documentIds.length === 0 &&
    videoIds.length === 0
  ) {
    return sendErrorResponse({
      res,
      message: "No file ids provided",
      code: 400,
    });
  }

  const Model = modelRegistry[resource];

  if (!Model) {
    throw new AppError(404, `Resource ${resource} not found`);
  }

  const pullQuery: any = {};

  if (imageIds.length > 0) {
    pullQuery.images = {
      _id: {
        $in: imageIds.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    };
  }

  if (documentIds.length > 0) {
    pullQuery.documents = {
      _id: {
        $in: documentIds.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    };
  }
  if (videoIds.length > 0) {
    pullQuery.videos = {
      _id: {
        $in: videoIds.map((id: string) => new mongoose.Types.ObjectId(id)),
      },
    };
  }

  const entity = await Model.findByIdAndUpdate(
    id,
    { $pull: pullQuery },
    { new: true },
  );

  if (!entity) {
    return sendErrorResponse({
      res,
      message: `${resource} not found`,
      code: 404,
    });
  }

  return sendSuccessResponse({
    res,
    message: "Files deleted successfully",
    data: {
      [formatResourceKey(resource)]: id,
    },
  });
});

