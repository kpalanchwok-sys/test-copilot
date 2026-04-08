import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import Enrolments from "../shared/models/enrolments";
import { enrolmentSchema } from "../shared/schema/zEnrolmentsSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapEnrolmentToResponse = (enrolment: any) => ({
  id: enrolment._id?.toString(),
  courseId: enrolment.courseId?.toString(),
  userId: enrolment.userId?.toString(),
  createdAt: enrolment.createdAt,
  updatedAt: enrolment.updatedAt,
});

export const createEnrolment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = enrolmentSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const enrolment = await Enrolments.create(result.data);

    return res.status(201).json(mapEnrolmentToResponse(enrolment));
  },
);

// export const getAllEnrolments = catchAsync(async (req: IRequest, res: Response) => {
//   const result = await crudService.getAll(Enrolments, {
//     req,
//     filterFields: ["contactId", "isRead"],
//     defaultSort: "-createdAt",
//     populate: [
//       {
//         path: "contactId",
//         select: "name email",
//       },
//     ],
//   });

//   sendSuccessResponse({
//     res,
//     data: result.data,
//     meta: result.meta,
//   });
// });

export const getSingleEnrolments = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const alert = await Enrolments.findById(id).populate(
      "contactId",
      "name email",
    );

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Enrolments not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: alert });
  },
);

export const markAlertAsRead = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const alert = await Enrolments.findById(id);

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Enrolments not found",
        code: 404,
      });
    }

    alert.isRead = true;
    await alert.save();

    sendSuccessResponse({ res, data: alert });
  },
);

export const deleteEnrolments = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = req.params;

    const alert = await Enrolments.findByIdAndDelete(id);

    if (!alert) {
      return sendErrorResponse({
        res,
        message: "Enrolments not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Enrolments deleted successfully",
    });
  },
);
