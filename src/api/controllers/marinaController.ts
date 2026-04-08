import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import Marina from "../shared/models/marina";
import {
  marinaParamsSchema,
  marinaSchema,
  marinaUpdateSchema,
} from "../shared/schema/zZarinaSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapMarinaToResponse = (marina: any) => ({
  id: marina._id?.toString(),
  name: marina.name || "",
  location: marina.location || "",
  googleLocation: marina.googleLocation || "",
  distance: marina.distance ?? null,
  mooringSpaceCount: marina.mooringSpaceCount ?? null,
  fuelAvailable: marina.fuelAvailable ?? false,
  shower: marina.shower ?? false,
  portableWater: marina.portableWater ?? false,
  openingHours: marina.openingHours || "",
  contact: marina.contact || "",
  website: marina.website || "",
  userRating: marina.userRating ?? null,
  description: marina.description || "",
  reviews: (marina.reviews || []).map((review: any) => ({
    username: review.username || "",
    rating: review.rating ?? 0,
    comment: review.comment || "",
    date: review.date?.toISOString() || null,
  })),
  createdAt: marina.createdAt?.toISOString(),
  updatedAt: marina.updatedAt?.toISOString(),
});

export const createMarina = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const data = marinaSchema.parse(req.body);
  const marina = await Marina.create(data);
  return res.status(201).json(mapMarinaToResponse(marina));
});

export const getAllMarinas = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const marinas = await Marina.find().sort({ name: 1 });
    return res.status(200).json(marinas.map(mapMarinaToResponse));
  },
);

export const getSingleMarina = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = marinaParamsSchema.parse(req.params);
    const marina = await Marina.findById(id);
    if (!marina) {
      return sendErrorResponse({ res, message: "Marina not found", code: 404 });
    }
    return res.status(200).json(mapMarinaToResponse(marina));
  },
);

export const updateMarina = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = marinaParamsSchema.parse(req.params);
  const data = marinaUpdateSchema.parse(req.body);

  const marina = await Marina.findById(id);
  if (!marina)
    return sendErrorResponse({ res, message: "Marina not found", code: 404 });

  Object.assign(marina, data);
  await marina.save();

  return res.status(200).json(mapMarinaToResponse(marina));
});

export const deleteMarina = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id } = marinaParamsSchema.parse(req.params);

  const marina = await Marina.findByIdAndDelete(id);

  if (!marina) {
    return sendErrorResponse({
      res,
      message: "Marina not found",
      code: 404,
    });
  }

  sendSuccessResponse({
    data: {},
    res,
    message: "Marina deleted successfully",
  });
});

export const addReview = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { username, rating, comment } = req.body;

  const marina = await Marina.findById(req.params.id);

  if (!marina) {
    return sendErrorResponse({
      res,
      message: "Marina not found",
      code: 404,
    });
  }

  marina.reviews.push({
    username,
    rating,
    comment,
    date: new Date(),
  });

  // Recalculate average rating
  const total = marina.reviews.reduce((sum, r) => sum + r.rating, 0);
  marina.userRating = total / marina.reviews.length;

  await marina.save();

  sendSuccessResponse({ res, data: marina });
});

// export const deleteReview = catchAsync(async (req: IRequest, res: Response) => {
//   const { marinaId, reviewId } = req.params;

//   const marina = await Marina.findById(marinaId);

//   if (!marina) {
//     return sendErrorResponse({
//       res,
//       message: "Marina not found",
//       code: 404,
//     });
//   }

//   marina.reviews = marina.reviews.filter((r) => r._id.toString() !== reviewId);

//   // Recalculate rating
//   if (marina.reviews.length > 0) {
//     const total = marina.reviews.reduce((sum, r) => sum + r.rating, 0);
//     marina.userRating = total / marina.reviews.length;
//   } else {
//     marina.userRating = 0;
//   }

//   await marina.save();

//   sendSuccessResponse({ res, data: marina });
// });
