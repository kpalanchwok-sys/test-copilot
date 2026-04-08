import { type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { saveExpoPushToken } from "../services/refreshTokenService";
import { IRequest } from "../shared/interfaces/IRequest";
import { registerPushTokenSchema } from "../shared/schema/zNotificationSchema";
import { catchAsync } from "../utils/catchAsync";
import { sendErrorResponse } from "../utils/responseHandler";

export const registerPushToken = catchAsync(
  async (req: IRequest, res: Response) => {
    const payload = registerPushTokenSchema.parse(req.body);
    const authenticatedUserId = req.user?._id?.toString();

    if (authenticatedUserId && authenticatedUserId !== payload.userId) {
      return sendErrorResponse({
        res,
        code: StatusCodes.FORBIDDEN,
        message: "User ID mismatch",
      });
    }

    const normalizedPlatform = payload.devicePlatform.trim().toLowerCase();
    const deviceId = `push-${normalizedPlatform}`;

    await saveExpoPushToken({
      userId: payload.userId,
      deviceId,
      pushNotificationDeviceId: payload.deviceToken,
    });

    return res.status(200).json({
      token: payload.deviceToken,
      createdAt: new Date().toISOString(),
      devicePlatform: payload.devicePlatform,
    });
  },
);
