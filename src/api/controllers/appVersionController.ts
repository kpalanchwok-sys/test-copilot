import { Request, Response } from "express";
import AppVersion from "../shared/models/appVersion";
import {
  appVersionParamsSchema,
  appVersionSchema,
} from "../shared/schema/zAppVersionSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const createAppVersion = catchAsync(
  async (req: Request, res: Response) => {
    const validatedBody = appVersionSchema.parse(req.body);

    const { platform } = validatedBody;

    // Deactivate previous active version for this platform
    await AppVersion.updateMany(
      { platform, isActive: true },
      { isActive: false },
    );

    const appVersion = await AppVersion.create(validatedBody);

    sendSuccessResponse({ res, data: appVersion });
  },
);

export const getLatestVersion = catchAsync(
  async (req: Request, res: Response) => {
    const { platform } = req.query;

    if (!platform) {
      return sendErrorResponse({
        res,
        message: "platform is required",
        code: 400,
      });
    }

    const version = await AppVersion.findOne({
      platform,
      isActive: true,
    });

    if (!version) {
      return sendErrorResponse({
        res,
        message: "No active version found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: version });
  },
);

// export const updateAppVersion = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const version = await AppVersion.findById(id);

//     if (!version) {
//       return sendErrorResponse({
//         res,
//         message: "Version not found",
//         code: 404,
//       });
//     }

//     Object.assign(version, req.body);
//     await version.save();

//     sendSuccessResponse({ res, data: version });
//   },
// );

export const deleteAppVersion = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = appVersionParamsSchema.parse(req.params);

    const version = await AppVersion.findByIdAndDelete(id);

    if (!version) {
      return sendErrorResponse({
        res,
        message: "Version not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Version deleted successfully",
    });
  },
);
