import { Response } from "express";
import { deleteEventService } from "../services/event.service";
import { IRequest } from "../shared/interfaces/IRequest";
import EventManagement from "../shared/models/eventManagement";
import {
  categorySchema,
  eventParamsSchema,
  eventSchema,
  eventUpdateSchema,
} from "../shared/schema/zEventSchema";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { uploadImageToS3 } from "../utils/s3";

const mapEventToResponse = (event: any) => ({
  id: event._id?.toString(),
  organizationId: event.OrganizationId?.toString(),
  name: event.name,
  categories: (event.categories || []).map((cat: any) => ({
    name: cat.name,
    description: cat.description || "",
    fee: cat.fee ?? 0,
  })),
  description: event.description || "",
  eventManager: event.eventManager || "",
  location: event.location,
  googleLocation: event.googleLocation || "",
  openingDate: event.openingDate ? event.openingDate.toISOString() : null,
  closingDate: event.closingDate ? event.closingDate.toISOString() : null,
  eventDate: event.eventDate ? event.eventDate.toISOString() : null,
  entryLimit: event.entryLimit ?? 0,
  image: event.image || "",
  status: event.status || "draft",
  isPublic: event.isPublic ?? true,
  createdBy: event.createdBy?.toString() || null,
  createdAt: event.createdAt?.toISOString(),
  updatedAt: event.updatedAt?.toISOString(),
});

export const upsertEvent = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  if (!userId) {
    throw new AppError(401, "You are not authorized to perform this action");
  }
  const eventId = req.params.id;

  let categories: any[] = [];

  if (req.body.categories) {
    if (typeof req.body.categories === "string") {
      try {
        categories = JSON.parse(req.body.categories);
      } catch {
        throw new AppError(400, "Invalid categories JSON");
      }
    } else {
      categories = req.body.categories;
    }
  }

  const normalizedBody = {
    ...req.body,
    categories,
  };

  const schema = eventId ? eventUpdateSchema : eventSchema;

  const result = schema.safeParse(normalizedBody);

  if (!result.success) {
    throw result.error;
  }

  const data = result.data;

  //  Handle image upload
  let imageUrl: string | undefined;

  if (req.file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new AppError(400, "Only JPG, JPEG, PNG allowed");
    }

    const safeName = req.file.originalname.replace(/\s+/g, "-");
    const key = `event/${userId}/${Date.now()}-${safeName}`;

    imageUrl = await uploadImageToS3(req.file.buffer, key, req.file.mimetype);
  }

  //  Prepare payload
  const payload: any = {
    ...data,
    createdBy: userId,
  };

  if (imageUrl) {
    payload.image = imageUrl;
  }

  let event;

  //  Update
  if (eventId) {
    event = await EventManagement.findOneAndUpdate(
      {
        _id: eventId,
        createdBy: userId,
        deletedAt: null,
      },
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!event) {
      throw new AppError(404, "Event not found");
    }

    return res.status(200).json(mapEventToResponse(event));
  }

  //  Create
  event = await EventManagement.create(payload);
  return res.status(200).json(mapEventToResponse(event));
});

export const getEventById = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { id: eventId } = eventParamsSchema.parse(req.params);
  const event = await EventManagement.findOne({
    _id: eventId,
    deletedAt: null,
    $or: [{ createdBy: userId }, { isPublic: true }],
  });
  if (!event) return res.status(404).json({ message: "Event not found" });

  return res.status(200).json(mapEventToResponse(event));
});

export const getMyEvents = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new AppError(
      401,
      "You are not authorized. Please login and try again.",
    );
  }

  const events = await EventManagement.find({
    $and: [{ createdBy: userId }, { isPublic: true }, { deletedAt: null }],
  }).sort({ createdAt: -1 });

  return res.status(200).json(events);
});

export const deleteEvent = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const params = eventParamsSchema.parse(req.params);
  const data = await deleteEventService(userId ?? "", params.id);

  return res.status(200).json(data);
});

export const createEventCategory = async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  try {
    const { id } = eventParamsSchema.parse(req.params);
    const { name, description, fee } = categorySchema.parse(req.body);

    if (!name || fee === undefined) {
      return res.status(400).json({
        message: "Name and fee are required",
      });
    }


    const event = await EventManagement.findOneAndUpdate(
      { _id: id, createdBy: userId, deletedAt: null },
      {
        $push: {
          categories: { name, description, fee },
        },
      },
      { new: true },
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Category added successfully",
      data: event.categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateEventCategory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const { id: eventId } = eventParamsSchema.parse(req.params);
    const { categoryName } = req.params;
    const { name, description, fee } = categorySchema.partial().parse(req.body); 

    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields["categories.$.name"] = name;
    if (description !== undefined)
      updateFields["categories.$.description"] = description;
    if (fee !== undefined) updateFields["categories.$.fee"] = fee;

    const event = await EventManagement.findOneAndUpdate(
      {
        _id: eventId,
        createdBy: userId,
        "categories.name": categoryName,
      },
      { $set: updateFields },
      { new: true },
    );

    if (!event) {
      return res.status(404).json({
        message: "Event or category not found",
      });
    }

    return res.status(200).json(event.categories);
  },
);

export const getEventCategories = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id: eventId } = eventParamsSchema.parse(req.params);

    const event = await EventManagement.findOne({
      _id: eventId,
      $and: [{ createdBy: userId }, { isPublic: true }, { deletedAt: null }],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(event.categories);
  },
);

export const deleteEventCategory = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id: eventId } = eventParamsSchema.parse(req.params);
    const { categoryName } = req.params;

    const event = await EventManagement.findOneAndUpdate(
      {
        _id: eventId,
        createdBy: userId,
        "categories.name": categoryName,
      },
      {
        $pull: {
          categories: { name: categoryName },
        },
      },
      { new: true },
    );

    if (!event) {
      return res.status(404).json({
        message: "Event or category not found",
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      data: event.categories,
    });
  },
);
