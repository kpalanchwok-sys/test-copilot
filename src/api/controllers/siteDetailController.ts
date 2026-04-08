import { Response } from "express";
import mongoose from "mongoose";
import { IRequest } from "../shared/interfaces/IRequest";
import { SiteDetail } from "../shared/models/siteDetails";
import {
  addReviewSchema,
  siteDetailParamsSchema,
  siteDetailSchema,
  siteDetailUpdateSchema,
} from "../shared/schema/zSiteDetailSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

export const mapSiteDetailToResponse = (site: any) => ({
  id: site._id?.toString(),
  name: site.name,
  location: site.location,
  googleLocation: site.googleLocation || "",
  category: site.category || "",
  distance: site.distance ?? null,
  openingHours: site.openingHours || "",
  fees: site.fees ?? 0,
  userRating: site.userRating ?? null,
  contact: site.contact || "",
  description: site.description || "",
  reviews: (site.reviews || []).map((r: any) => ({
    id: r.id,
    username: r.username,
    rating: r.rating,
    comment: r.comment || "",
    date: r.date?.toISOString() || null,
  })),
  createdAt: site.createdAt,
  updatedAt: site.updatedAt,
});

export const createSiteDetail = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const data = siteDetailSchema.parse(req.body);

    const site = await SiteDetail.create(data);
    return res.status(200).json(mapSiteDetailToResponse(site));
  },
);

export const getAllSiteDetails = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await SiteDetail.find();

    return res.status(200).json(result.map(mapSiteDetailToResponse));
  },
);

export const getSingleSiteDetail = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = siteDetailParamsSchema.parse(req.params);

    const site = await SiteDetail.findById(id);

    if (!site) {
      return sendErrorResponse({ res, message: "Site not found", code: 404 });
    }

    return res.status(200).json(mapSiteDetailToResponse(site));
  },
);

export const updateSiteDetail = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = siteDetailParamsSchema.parse(req.params);
    const data = siteDetailUpdateSchema.parse(req.body);

    const site = await SiteDetail.findById(id);
    if (!site) {
      return sendErrorResponse({ res, message: "Site not found", code: 404 });
    }

    Object.assign(site, data);
    await site.save();

    return res.status(200).json(mapSiteDetailToResponse(site));
  },
);

export const deleteSiteDetail = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = siteDetailParamsSchema.parse(req.params);

    const site = await SiteDetail.findByIdAndDelete(id);

    if (!site) {
      return sendErrorResponse({ res, message: "Site not found", code: 404 });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Site deleted successfully",
    });
  },
);

export const addSiteDetailReview = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = siteDetailParamsSchema.parse(req.params);

    const { username, rating, comment } = addReviewSchema.parse(req.body);

    const siteDetail = await SiteDetail.findById(id);
    if (!siteDetail) {
      return sendErrorResponse({
        res,
        message: "SiteDetail not found",
        code: 404,
      });
    }

    const newReview = {
      id: new mongoose.Types.ObjectId().toString(),
      username,
      rating,
      comment,
      date: new Date(),
    };

    siteDetail.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = siteDetail.reviews.reduce(
      (acc, r) => acc + r.rating,
      0,
    );

    siteDetail.userRating = Number(
      (totalRating / siteDetail.reviews.length).toFixed(1),
    );

    await siteDetail.save();

    sendSuccessResponse({
      res,
      data: siteDetail,
      message: "Review added successfully",
    });
  },
);
