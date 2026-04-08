import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import CommunityForum from "../shared/models/communityForums";
import {
  commentSchema,
  forumParamsSchema,
  forumSchema,
  forumUpdateSchema,
} from "../shared/schema/zCommunityForumSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapForumToResponse = (forum: any) => ({
  id: forum._id?.toString(),

  subject: forum.subject,
  description: forum.description || "",
  username: forum.username,

  date: forum.date ?? null,
  createdAt: forum.createdAt,
  updatedAt: forum.updatedAt,

  likeCount: forum.likeCount ?? 0,

  comments: Array.isArray(forum.comments)
    ? forum.comments.map((comment: any) => ({
        id: comment._id?.toString(),
        username: comment.username,
        text: comment.text,
        date: comment.date ?? null,
      }))
    : [],
});

export const createCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = forumSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const forum = await CommunityForum.create(result.data);

    return res.status(201).json(mapForumToResponse(forum));
  },
);

export const getAllCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const post = await CommunityForum.find();

    if (!post) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }

    return res.status(200).json(post);
  },
);

export const getSingleCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = forumParamsSchema.parse(req.params);

    const forum = await CommunityForum.findById(id);

    if (!forum) {
      return sendErrorResponse({
        res,
        message: "Post not found",
        code: 404,
      });
    }
    return res.status(201).json(mapForumToResponse(forum));
  },
);

export const updateCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = forumParamsSchema.parse(req.params);

    const validatedData = forumUpdateSchema.parse(req.body);

    const post = await CommunityForum.findById(id);

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

export const deleteCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = forumParamsSchema.parse(req.params);

    const post = await CommunityForum.findByIdAndDelete(id);

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
  const { id } = forumParamsSchema.parse(req.params);

  const { username, text } = commentSchema
    .pick({ username: true, text: true })
    .parse(req.body);

  const post = await CommunityForum.findById(id);
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

    const post = await CommunityForum.findById(postId);

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

export const likeCommunityForum = catchAsync(
  async (req: IRequest, res: Response) => {
    const { id } = forumParamsSchema.parse(req.params);

    // Increment likeCount atomically
    const post = await CommunityForum.findByIdAndUpdate(
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
