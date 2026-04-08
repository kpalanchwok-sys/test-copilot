import { Request, Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { CommunityNews } from "../shared/models/communityNews";
import {
  communityNewsParamsSchema,
  communityNewsSchema,
  communityNewsUpdateSchema,
} from "../shared/schema/zCommunityNewsSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapNewsToResponse = (news: any) => ({
  id: news._id?.toString(),

  subject: news.subject,
  description: news.description || "",
  images: news.images,

  viewCount: news.viewCount ?? 0,

  createdAt: news.createdAt,
  updatedAt: news.updatedAt,
  createdBy: news.createdBy,
});

export const createCommunityNews = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const result = communityNewsSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const news = await CommunityNews.create({
      ...result.data,
      createdBy: userId,
    });

    return res.status(201).json(mapNewsToResponse(news));
  },
);

export const updateCommunityNews = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = communityNewsParamsSchema.parse(req.params);

    const validatedData = communityNewsUpdateSchema.parse(req.body);

    const communityNews = await CommunityNews.findById(id);

    if (!communityNews) {
      return sendErrorResponse({
        res,
        message: "communityNew not found",
        code: 404,
      });
    }

    Object.assign(communityNews, validatedData);
    await communityNews.save();

    sendSuccessResponse({ res, data: communityNews });
  },
);

export const getSingleCommunityNews = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = communityNewsParamsSchema.parse(req.params);

    const news = await CommunityNews.findById(id).populate(
      "createdBy",
      "firstName lastName",
    );
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    return res.status(200).json(mapNewsToResponse(news));
  },
);

export const getAllCommunityNews = catchAsync(
  async (req: Request, res: Response) => {
    const newsList = await CommunityNews.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(newsList.map(mapNewsToResponse));
  },
);

export const deleteCommunityNews = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = communityNewsParamsSchema.parse(req.params);

    const communityNew = await CommunityNews.findByIdAndDelete(id);

    if (!communityNew) {
      return sendErrorResponse({
        res,
        message: "communityNew not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "communityNew deleted successfully",
    });
  },
);
