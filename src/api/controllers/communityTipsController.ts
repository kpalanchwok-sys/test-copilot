import { Response } from "express";
import CommunityTips from "../shared/models/communityTips";
import {
  commentSchema,
  communityTipsParamsSchema,
  communityTipsSchema,
  communityTipsUpdateSchema,
} from "../shared/schema/zCommunityTipsSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";
import { IRequest } from "../shared/interfaces/IRequest";

export const createCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const validatedData = communityTipsSchema.parse(req.body);

    const post = await CommunityTips.create(validatedData);

    sendSuccessResponse({ res, data: post });
  },
);

export const getAllCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const tips = await CommunityTips.find();

    if (!tips) {
      return sendErrorResponse({
        res,
        message: "Community-Tips not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: tips });
  },
);
export const getSingleCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = communityTipsParamsSchema.parse(req.params);
    const post = await CommunityTips.findById(id);

    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: post });
  },
);

export const updateCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = communityTipsParamsSchema.parse(req.params);
    const validatedData = communityTipsUpdateSchema.parse(req.body);
    const post = await CommunityTips.findById(id);
    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    Object.assign(post, validatedData);
    await post.save();

    sendSuccessResponse({ res, data: post });
  },
);

export const deleteCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = communityTipsParamsSchema.parse(req.params);

    const post = await CommunityTips.findByIdAndDelete(id);

    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Post deleted successfully",
    });
  },
);

export const addComment = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = communityTipsParamsSchema.parse(req.params);

  const { username, text } = commentSchema
    .pick({ username: true, text: true })
    .parse(req.body);

  const post = await CommunityTips.findById(id);

  if (!post) {
    return sendErrorResponse({
      res,
      message: "Post not found",
      code: 404,
    });
  }

  post.comments.push({
    username,
    text,
    date: new Date(),
  });

  await post.save();

  sendSuccessResponse({ res, data: post });
});

export const deleteComment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { postId, commentId } = req.params;

    const post = await CommunityTips.findById(postId);

    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    post.comments = post.comments.filter(
      (c) => c._id?.toString() !== commentId,
    );

    await post.save();

    sendSuccessResponse({
      data: {},
      res,
      message: "Comment deleted",
    });
  },
);

export const likeCommunityTips = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = communityTipsParamsSchema.parse(req.params);

    const post = await CommunityTips.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true },
    );

    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: post });
  },
);
