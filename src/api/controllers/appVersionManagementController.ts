import { Request, Response } from "express";
import { saveExpoPushToken } from "../services/refreshTokenService";
import { IRequest } from "../shared/interfaces/IRequest";
import { UserDevice } from "../shared/models/userDevice";
import UserManagement from "../shared/models/userManagement";
import {
  saveExpoPushTokenSchema,
  userDeviceSchema,
} from "../shared/schema/zAppVersionManagementSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const registerDevice = catchAsync(
  async (req: Request, res: Response) => {
    const result = userDeviceSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error; // Throw ZodError, caught by globalErrorHandler
    }

    const { userId, deviceId, appVersion, platform, osVersion, deviceModel } =
      result.data;

    const device = await UserDevice.findOneAndUpdate(
      { userId, deviceId },
      {
        appVersion,
        platform,
        osVersion,
        deviceModel,
        lastLoginAt: new Date(),
        isActive: true,
      },
      { new: true, upsert: true },
    );

    return sendSuccessResponse({ res, data: device });
  },
);

export const getSingleDevice = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const device = await UserManagement.findById(id);
    //   .populate(
    //   "userId",
    //   "firstName lastName email",
    // );

    if (!device) {
      return sendErrorResponse({
        res,
        message: "User not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: device });
  },
);

export const getAllDevices = catchAsync(async (req: Request, res: Response) => {
  const result = await UserDevice.find();
  //   {
  //   populate: [
  //     {
  //       path: "userId",
  //       select: "firstName lastName email",
  //     },
  //   ],
  // };,

  return sendSuccessResponse({
    res,
    data: result,
  });
});

export const updateDevice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const device = await UserDevice.findById(id);

  if (!device) {
    return sendErrorResponse({
      res,
      message: "Device not found",
      code: 404,
    });
  }

  Object.assign(device, req.body);
  await device.save();

  sendSuccessResponse({ res, data: device });
});

export const saveExpoPushTokenController = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return sendErrorResponse({
        res,
        code: 401,
        message: "Unauthorized",
      });
    }

    const payload = saveExpoPushTokenSchema.parse(req.body);
    await saveExpoPushToken({
      userId,
      deviceId: payload.deviceId,
      pushNotificationDeviceId: payload.pushNotificationDeviceId,
    });

    return sendSuccessResponse({
      res,
      data: {
        userId,
        deviceId: payload.deviceId,
        pushNotificationDeviceId: payload.pushNotificationDeviceId,
      },
      message: "Expo push token saved successfully",
    });
  },
);
