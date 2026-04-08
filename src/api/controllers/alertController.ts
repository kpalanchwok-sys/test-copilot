import { Request, Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import Alert from "../shared/models/alert";
import { contactIdBodySchema } from "../shared/schema/zAlertSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapContactToResponse = (contact: any) => ({
  id: contact._id?.toString(),
  firstName: contact.firstName,
  lastName: contact.lastName,
  email: contact.email,
  phone: contact.phone,
  createdAt: contact.createdAt,
  updatedAt: contact.updatedAt,
});

export const createAlert = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { contactId } = contactIdBodySchema.parse(req.body);

  const alert = await Alert.create({
    contactId,
    createdBy: userId,
  });
  return res.status(201).json(mapContactToResponse(alert));
});

export const getSingleAlert = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const alert = await Alert.findById(id).populate("contactId", "name email");

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Alert not found",
        code: 404,
      });
    }

    return res.status(200).json(mapContactToResponse(alert));
  },
);

export const markAlertAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const alert = await Alert.findById(id);

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Alert not found",
        code: 404,
      });
    }

    alert.isRead = true;
    await alert.save();

    sendSuccessResponse({ res, data: alert });
  },
);

export const deleteAlert = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const alert = await Alert.findByIdAndDelete(id);

  if (!alert) {
    return sendErrorResponse({
      res,
      message: "Alert not found",
      code: 404,
    });
  }

  sendSuccessResponse({
    data: {},
    res,
    message: "Alert deleted successfully",
  });
});
