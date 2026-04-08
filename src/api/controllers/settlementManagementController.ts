// // to do

// import { Request, Response } from "express";
// // import { SettlementManagement } from "../shared/models/serviceJob";
// import { catchAsync } from "../utils/catchAsync";
// import {
//   sendErrorResponse,
//   sendSuccessResponse,
// } from "../utils/responseHandler";

// export const createSettlementManagement = catchAsync(
//   async (req: Request, res: Response) => {
//     const { boatId, title } = req.body;

//     if (!boatId || !title) {
//       return sendErrorResponse({
//         res,
//         message: "boatId and title are required",
//         code: 400,
//       });
//     }

//     const request = await SettlementManagement.create(req.body);

//     sendSuccessResponse({ res, data: request });
//   },
// );

// export const getAllSettlementManagements = catchAsync(
//   async (req: Request, res: Response) => {
//     const result = await SettlementManagement.find();

//     sendSuccessResponse({
//       res,
//       data: result,
//     });
//   },
// );

// export const getSingleSettlementManagement = catchAsync(
//   async (req: Request, res: Response) => {
//     const request = await SettlementManagement.findById(req.params.id)
//       .populate("boatId", "boatName")
//       .populate("serviceProviderId", "name email");

//     if (!request) {
//       return sendErrorResponse({
//         res,
//         message: "Service request not found",
//         code: 404,
//       });
//     }

//     sendSuccessResponse({ res, data: request });
//   },
// );

// export const updateSettlementManagement = catchAsync(
//   async (req: Request, res: Response) => {
//     const request = await SettlementManagement.findById(req.params.id);

//     if (!request) {
//       return sendErrorResponse({
//         res,
//         message: "Service request not found",
//         code: 404,
//       });
//     }

//     Object.assign(request, req.body);
//     await request.save();

//     sendSuccessResponse({ res, data: request });
//   },
// );

// export const deleteSettlementManagement = catchAsync(
//   async (req: Request, res: Response) => {
//     const request = await SettlementManagement.findByIdAndDelete(req.params.id);

//     if (!request) {
//       return sendErrorResponse({
//         res,
//         message: "Service request not found",
//         code: 404,
//       });
//     }

//     sendSuccessResponse({
//       data: {},
//       res,
//       message: "Service request deleted successfully",
//     });
//   },
// );
