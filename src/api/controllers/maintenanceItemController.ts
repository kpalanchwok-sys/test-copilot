import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import MaintenanceItem from "../shared/models/maintenanceItem";
import {
  boatIdParamSchema,
  boatIssueParamsSchema,
  boatIssueSchema,
  boatIssueUpdateSchema,
} from "../shared/schema/zMaintenanceItemSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";


const mapBoatIssueToResponse = (issue: any) => {
  const reminder = issue.maintenanceItemReminders?.[0]; // 👈 pick latest

  return {
    id: issue._id?.toString(),
    boatId: issue.boatId?.toString(),

    images: issue.images || [],
    videos: issue.videos || [],
    documents: issue.documents || [],
    youtubeLinks: issue.youtubeLinks || [],

    title: issue.title || "",
    description: issue.description || "",

    priority: issue.priority,
    status: issue.status,
    reportedBy: issue.reportedBy || null,

    dateReported: issue.dateReported?.toISOString() || null,
    resolvedAt: issue.resolvedAt?.toISOString() || null,

    createdAt: issue.createdAt?.toISOString(),
    updatedAt: issue.updatedAt?.toISOString(),

    hasMaintenanceItemSet: (issue.hasMaintenanceItemSet || 0) > 0, // boolean flag

    reminders: reminder
      ? {
          id: reminder._id?.toString(),
          dueDate: reminder.dueDate,
          setReminderBefore: reminder.setReminderBefore,
          assignShareReminder: reminder.assignShareReminder,
          email: reminder.email || [],
          repeatSetting: reminder.repeatSetting,
        }
      : null,
  };
};

export const createMaintenanceItem = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const data = boatIssueSchema.parse(req.body);
    const issue = await MaintenanceItem.create(data);
    return res.status(201).json(mapBoatIssueToResponse(issue));
  },
);

export const getAllMaintenanceItem = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const issues = await MaintenanceItem.find()
      .populate("hasMaintenanceItemSet")
      .populate("maintenanceItemReminders")
      .sort({ dateReported: -1 });
    return res.status(200).json(issues.map(mapBoatIssueToResponse));
  },
);

export const getSingleMaintenanceItem = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = boatIssueParamsSchema.parse(req.params);
    const issue = await MaintenanceItem.findById(id)
      .populate("hasMaintenanceItemSet")
      .populate("maintenanceItemReminders");

    if (!issue) {
      return sendErrorResponse({
        res,
        message: "Issue not found",
        code: 404,
      });
    }
    return res.status(200).json(mapBoatIssueToResponse(issue));
  },
);

export const updateMaintenanceItem = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = boatIssueParamsSchema.parse(req.params);
    const data = boatIssueUpdateSchema.parse(req.body);

    const issue = await MaintenanceItem.findById(id).populate(
      "hasMaintenanceItemSet",
    );

    if (!issue) {
      return sendErrorResponse({
        res,
        message: "Issue not found",
        code: 404,
      });
    }

    if (req.body.status === "resolved" && issue.status !== "resolved") {
      req.body.resolvedAt = new Date();
    }

    Object.assign(issue, data);
    await issue.save();

    return res.status(200).json(mapBoatIssueToResponse(issue));
  },
);

export const deleteMaintenanceItem = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = boatIssueParamsSchema.parse(req.params);

    const issue = await MaintenanceItem.findByIdAndDelete(id);

    if (!issue) {
      return sendErrorResponse({
        res,
        message: "Issue not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Issue deleted successfully",
    });
  },
);

export const getMaintenanceItemBoatById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { boatId } = boatIdParamSchema.parse(req.params);

    const items = await MaintenanceItem.find({ boatId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(items.map(mapBoatIssueToResponse));
  },
);
