import { Request, Response } from "express";
// import { UserDevice } from "../shared/models/userDeviceManagement";
import { IRequest } from "../shared/interfaces/IRequest";
import { UserDevice } from "../shared/models/userDevice";
import {
  userDeviceParamsSchema,
  userDeviceSchema,
} from "../shared/schema/zUserDeviceSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapUserDeviceToResponse = (device: any) => ({
  id: device._id?.toString(),
  userId: device.userId,
  deviceId: device.deviceId,
  platform: device.platform,
  appVersion: device.appVersion,
  osVersion: device.osVersion || "",
  deviceModel: device.deviceModel || "",
  createdAt: device.createdAt,
  updatedAt: device.updatedAt,
});

export const createUserDevice = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const data = userDeviceSchema.parse(req.body);

    const device = await UserDevice.findOneAndUpdate(
      { userId: data.userId, deviceId: data.deviceId },
      { $set: data },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json(mapUserDeviceToResponse(device));
  },
);

// export const createUserDevice = catchAsync(
//   async (req: Request, res: Response) => {
//     const { userId, deviceId, platform, appVersion, osVersion, deviceModel } =
//       req.body;

//     // ---------- Validation ----------
//     if (!userId || !deviceId || !platform || !appVersion) {
//       return sendErrorResponse({
//         res,
//         message: "userId, deviceId, platform and appVersion are required",
//         code: 400,
//       });
//     }

//     if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
//       return sendErrorResponse({
//         res,
//         message: "Invalid userId format",
//         code: 400,
//       });
//     }

//     // Upsert device
//     const device = await UserDevice.findOneAndUpdate(
//       { userId, deviceId }, // filter
//       { userId, deviceId, platform, appVersion, osVersion, deviceModel }, // update
//       { new: true, upsert: true }, // return updated or newly created doc
//     );
//     const response = {
//       deviceId: device.deviceId,
//       platform: device.platform,
//       osVersion: device.osVersion,
//       deviceModel: device.deviceModel,
//       appVersion: device.appVersion,
//     };

//     sendSuccessResponse({
//       res,
//       data: response,
//     });
//   },
// );

// Get All User Devices
export const getAllUserDevices = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
      return sendErrorResponse({
        res,
        message: "User-Id is required",
        code: 400,
      });
    }

    //  validate ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId as string)) {
      return sendErrorResponse({
        res,
        message: "Invalid User-Id format",
        code: 400,
      });
    }

    const devices = await UserDevice.find({ userId })
      .select(
        "deviceId platform osVersion deviceModel appVersion createdAt -_id",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(devices.map(mapUserDeviceToResponse));
  },
);

export const getSingleUserDevice = catchAsync(
  async (req: Request, res: Response) => {
    const device = await UserDevice.findById(req.params.id);
    if (!device) {
      return sendErrorResponse({ res, message: "Device not found", code: 404 });
    }
    return res.status(200).json(mapUserDeviceToResponse(device));
  },
);

export const updateUserDevice = catchAsync(
  async (req: Request, res: Response) => {
    const device = await UserDevice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!device) {
      return sendErrorResponse({ res, message: "Device not found", code: 404 });
    }
    return res.status(200).json(mapUserDeviceToResponse(device));
  },
);

export const deleteUserDevice = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = userDeviceParamsSchema.parse(req.params);
    const device = await UserDevice.findByIdAndDelete(req.params.id);
    if (!device)
      return sendErrorResponse({ res, message: "Device not found", code: 404 });
    sendSuccessResponse({
      data: {},
      res,
      message: "Device deleted successfully",
    });
  },
);
