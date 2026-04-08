import { Response } from "express";
import { trackCommunityNewsViewService } from "../services/communityNewsViewCountService";
import { IRequest } from "../shared/interfaces/IRequest";
import { catchAsync } from "../utils/catchAsync";
import { getClientIp, getClientUserAgent } from "../utils/clientIp";
import mongoose from "mongoose";

export const trackCommunityNewsView = catchAsync(
  async (req: IRequest, res: Response) => {
    const newsIdString = Array.isArray(req.params.newsId)
      ? req.params.newsId[0]
      : req.params.newsId;
    const newsId = new mongoose.Types.ObjectId(newsIdString);
    const { sessionId } = req.body;

    const { user } = req;

    const result = await trackCommunityNewsViewService({
      newsId,
      sessionId,
      ipAddress: getClientIp(req),
      userAgent: getClientUserAgent(req),
      userId: user?._id,
    });

    return res.status(200).json(result);
  },
);
