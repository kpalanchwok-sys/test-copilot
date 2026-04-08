import mongoose from "mongoose";
import config from "../config";
import { CommunityNews } from "../shared/models/communityNews";
import { CommunityNewsView } from "../shared/models/communityNewsView";
import { AppError } from "../utils/AppError";

export const trackCommunityNewsViewService = async (payload: {
  newsId: mongoose.Types.ObjectId;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: mongoose.Types.ObjectId;
}) => {
  const { newsId, sessionId, ipAddress, userAgent, userId } = payload;

  if (!newsId || !sessionId) {
    throw new AppError(400, "newsId and sessionId are required");
  }

  const news = await CommunityNews.findById(newsId);
  if (!news) {
    throw new AppError(404, "Community news not found");
  }

  //  Deduplication by sessionId + newsId
  const viewKey = `community_news_view:${newsId}:${sessionId}`;
  const ignoreWindow =
    config.ENV !== "production" ? 1 * 60 * 1000 : 60 * 60 * 1000; // 1 min staging, 1 hr production

  const existingView = await CommunityNewsView.findOne({ newsId, sessionId });

  if (existingView) {
    const now = new Date().getTime();
    const created = new Date(existingView.createdAt).getTime();
    const actualIgnoreTime = created + ignoreWindow;

    if (actualIgnoreTime > now) {
      return { success: true, deduped: true };
    }
  }

  // Increment viewCount atomically
  await CommunityNews.findByIdAndUpdate(newsId, { $inc: { viewCount: 1 } });

  // Record the view for future dedup checks
  await CommunityNewsView.create({
    newsId,
    sessionId,
    ipAddress,
    userAgent,
    userId,
  });

  return { success: true };
};
