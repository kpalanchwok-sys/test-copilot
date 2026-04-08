import { Response } from "express";
import { ContactInquiry } from "../shared/models/inquiry";
import { contactInquirySchema } from "../shared/schema/zContactInquirySchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";
import { IRequest } from "../shared/interfaces/IRequest";

const mapInquiryToResponse = (inquiry: any) => ({
  id: inquiry._id?.toString(),
  name: inquiry.name,
  email: inquiry.email,
  mobileNumber: inquiry.mobileNumber,
  message: inquiry.message,
  preferredContactMethod: inquiry.preferredContactMethod || null,
  status: inquiry.status || "new",
  createdBy: inquiry.createdBy?.toString() || null,
  createdAt: inquiry.createdAt?.toISOString(),
  updatedAt: inquiry.updatedAt?.toISOString(),
});

export const createInquiry = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const data = contactInquirySchema.parse(req.body); // Zod validation

  const inquiry = await ContactInquiry.create(data);
  return res.status(201).json(mapInquiryToResponse(inquiry));
});

export const updateInquiry = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const inquiry = await ContactInquiry.findById(req.params.id);

  if (!inquiry) {
    return sendErrorResponse({
      res,
      message: "Inquiry not found",
      code: 404,
    });
  }

  Object.assign(inquiry, req.body);
  await inquiry.save();

  sendSuccessResponse({ res, data: inquiry });
});

export const getSingleInquiry = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) {
      return sendErrorResponse({
        res,
        message: "Inquiry not found",
        code: 404,
      });
    }

    sendSuccessResponse({ res, data: inquiry });
  },
);

export const deleteInquiry = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    return sendErrorResponse({
      res,
      message: "Inquiry not found",
      code: 404,
    });
  }

  sendSuccessResponse({
    data: {},
    res,
    message: "Inquiry deleted successfully",
  });
});

// export const getAllInquiries = catchAsync(
//   async (req: IRequest, res: Response) => {
//     const result = await crudService.getAll(ContactInquiry, {
//       req,
//       searchFields: ["name", "email", "mobileNumber"],
//       filterFields: ["status", "preferredContactMethod"],
//       defaultSort: "-createdAt",
//     });

//     sendSuccessResponse({
//       res,
//       data: result.data,
//       meta: result.meta,
//     });
//   },
// );
