import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import BoatProject from "../shared/models/boatProject";
import {
  boatProjectParamsSchema,
  boatProjectSchema,
  boatProjectUpdateSchema,
  commentParamsSchema,
  commentSchema,
} from "../shared/schema/zBoatProjectSchema";
import { catchAsync } from "../utils/catchAsync";

const formatBoatProjectResponse = (boatProject: any) => ({
  id: boatProject.id,
  boatId: boatProject.boatId,
  projectName: boatProject.projectName,
  category: boatProject.category || "",
  type: boatProject.type || "",
  notes: boatProject.notes || "",
  startDate: boatProject.startDate || "",
  images: boatProject.images || "",
  comments: boatProject.comments || "",
  createdBy: boatProject.createdBy || "",
});

export const createBoatProject = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const body = boatProjectSchema.parse(req.body);

    const project = await BoatProject.create({
      ...body,
      createdBy: userId,
    });

    return res.status(201).json(formatBoatProjectResponse(project));
  },
);

export const getAllBoatProjects = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const projects = await BoatProject.find({ createdBy: userId });

    return res.status(200).json(projects);
  },
);

export const getBoatProjectById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { projectId } = boatProjectParamsSchema.parse(req.params);

    const project = await BoatProject.findOne({
      _id: projectId,
      createdBy: userId,
    }).populate([
      {
        path: "boatId",
        select: "boatName id",
      },
      {
        path: "comments.commenter",
        select: "firstName lastName  id avatar",
      },
    ]);

    if (!project) {
      return res.json({ message: "Project not found" });
    }

    return res.status(201).json(formatBoatProjectResponse(project));
  },
);

export const updateBoatProject = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { projectId } = boatProjectParamsSchema.parse(req.params);
    const body = boatProjectUpdateSchema.parse(req.body);

    const project = await BoatProject.findOneAndUpdate(
      { _id: projectId, createdBy: userId },
      { $set: body },
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(201).json(formatBoatProjectResponse(project));
  },
);

export const deleteBoatProject = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { projectId } = boatProjectParamsSchema.parse(req.params);

    const project = await BoatProject.findOneAndDelete({
      _id: projectId,
      createdBy: userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  },
);

export const addComment = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();

  const { projectId } = boatProjectParamsSchema.parse(req.params);
  const body = commentSchema.parse({ ...req.body, commenter: userId });

  const project = await BoatProject.findByIdAndUpdate(
    projectId,
    {
      $push: {
        comments: {
          ...body,
          fullName: req.user?.fullName,
        },
      },
    },
    { new: true },
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.status(200).json(project.comments);
});

export const updateComment = catchAsync(
  async (req: IRequest, res: Response) => {
    const { projectId, commentId } = commentParamsSchema.parse(req.params);
    const body = commentSchema.partial().parse(req.body);

    const updateFields: Record<string, unknown> = {};
    if (body.text !== undefined) updateFields["comments.$.text"] = body.text;

    const project = await BoatProject.findOneAndUpdate(
      { _id: projectId, "comments._id": commentId },
      { $set: updateFields },
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: "Project or comment not found" });
    }

    return res.status(200).json(project.comments);
  },
);

export const getAllComments = catchAsync(
  async (req: IRequest, res: Response) => {
    const { projectId } = boatProjectParamsSchema.parse(req.params);

    const project = await BoatProject.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project.comments);
  },
);

export const getSingleComment = catchAsync(
  async (req: IRequest, res: Response) => {
    const { projectId, commentId } = commentParamsSchema.parse(req.params);

    const project = await BoatProject.findOne({
      _id: projectId,
      "comments._id": commentId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project or comment not found" });
    }

    const comment = project.comments.find(
      (c) => c._id?.toString() === commentId,
    );

    return res.status(200).json(comment);
  },
);

export const deleteComment = catchAsync(
  async (req: IRequest, res: Response) => {
    const { projectId, commentId } = commentParamsSchema.parse(req.params);

    const project = await BoatProject.findOneAndUpdate(
      { _id: projectId, "comments._id": commentId },
      { $pull: { comments: { _id: commentId } } },
      { new: true },
    );

    if (!project) {
      return res.status(404).json({ message: "Project or comment not found" });
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
      data: project.comments,
    });
  },
);
