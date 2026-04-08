import { Request, Response } from "express";
import FuelLog from "../shared/models/fuelWaterLog";
import {
  fuelLogParamsSchema,
  fuelLogSchema,
  fuelLogUpdateSchema,
} from "../shared/schema/zFuelLogSchema";
import { catchAsync } from "../utils/catchAsync";
import { sendErrorResponse } from "../utils/responseHandler";

const mapFuelLogToResponse = (log: any) => ({
  id: log._id?.toString(),
  boatId: log.boatId?.toString(),
  date: log.date ? log.date.toISOString() : null,
  type: log.type,
  litres: log.litres,
  currentLevel: log.currentLevel ?? null,
  lastFilled: log.lastFilled ? log.lastFilled.toISOString() : null,
  lastService: log.lastService ? log.lastService.toISOString() : null,
  pricePerLitre: log.pricePerLitre ?? null,
  amount: log.amount ?? null,
  fuelSupplier: log.fuelSupplier || "",
  location: log.location || "",
  paymentMethod: log.paymentMethod || "",
  tank: log.tank || "",
  capacity: log.capacity ?? null,
  levelBefore: log.levelBefore ?? null,
  levelAfter: log.levelAfter ?? null,
  engineHours: log.engineHours ?? null,
  weather: log.weather || "",
  gpsLocation: log.gpsLocation || "",
  nextServiceDate: log.nextServiceDate
    ? log.nextServiceDate.toISOString()
    : null,
  notes: log.notes || "",
  images: log.images || [],
  videos: log.videos || [],
  documents: log.documents || [],
  createdAt: log.createdAt?.toISOString(),
  updatedAt: log.updatedAt?.toISOString(),
});

export const createFuelLog = catchAsync(async (req: Request, res: Response) => {
  const data = fuelLogSchema.parse(req.body);

  if (data.pricePerLitre !== undefined && data.litres !== undefined) {
    data.amount = data.pricePerLitre * data.litres;
  }

  if (
    data.levelBefore !== undefined &&
    data.levelAfter !== undefined &&
    data.levelAfter < data.levelBefore
  ) {
    return sendErrorResponse({
      res,
      message: "levelAfter cannot be less than levelBefore",
      code: 400,
    });
  }

  const fuelLog = await FuelLog.create(data);
  return res.status(201).json(mapFuelLogToResponse(fuelLog));
});

export const updateFuelLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = fuelLogParamsSchema.parse(req.params);
  const data = fuelLogUpdateSchema.parse(req.body);

  const log = await FuelLog.findById(id);
  if (!log) {
    return sendErrorResponse({ res, message: "Fuel log not found", code: 404 });
  }

  // Recalculate amount
  if (data.litres !== undefined || data.pricePerLitre !== undefined) {
    const litres = data.litres ?? log.litres;
    const price = data.pricePerLitre ?? log.pricePerLitre;
    if (litres !== undefined && price !== undefined)
      data.amount = litres * price;
  }

  if (
    data.levelBefore !== undefined &&
    data.levelAfter !== undefined &&
    data.levelAfter < data.levelBefore
  ) {
    return sendErrorResponse({
      res,
      message: "levelAfter cannot be less than levelBefore",
      code: 400,
    });
  }

  Object.assign(log, data);
  await log.save();

  return res.status(200).json(mapFuelLogToResponse(log));
});

export const getAllFuelLogs = catchAsync(
  async (req: Request, res: Response) => {
    const logs = await FuelLog.find();
    return res.status(200).json(logs.map(mapFuelLogToResponse));
  },
);

export const getSingleFuelLog = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = fuelLogParamsSchema.parse(req.params);
    const log = await FuelLog.findById(id).populate("boatId", "name");

    if (!log) {
      return sendErrorResponse({
        res,
        message: "Fuel log not found",
        code: 404,
      });
    }

    return res.status(200).json(mapFuelLogToResponse(log));
  },
);

export const deleteFuelLog = catchAsync(async (req: Request, res: Response) => {
  const { id } = fuelLogParamsSchema.parse(req.params);
  const log = await FuelLog.findByIdAndDelete(id);

  if (!log) {
    return sendErrorResponse({
      res,
      message: "Fuel log not found",
      code: 404,
    });
  }

  return res.status(200).json(mapFuelLogToResponse(log));
});
