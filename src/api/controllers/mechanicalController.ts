import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { Mechanical } from "../shared/models/mechanical";
import {
  deleteEngineParamsSchema,
  engineSchema,
  mechanicalParamsSchema,
  mechanicalSchema,
  mechanicalUpdateSchema,
  upsertEngineParamsSchema,
} from "../shared/schema/zMechanicalSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapMechanicalToResponse = (mechanical: any) => ({
  id: mechanical._id?.toString(),
  boatId: mechanical.boatId?.toString(),
  description: mechanical.description || "",
  upcomingService: mechanical.upcomingService || {},
  engines: (mechanical.engines || []).map((engine: any) => ({
    engineSide: engine.engineSide || "",
    model: engine.model || "",
    serialNumber: engine.serialNumber || "",
    installedOn: engine.installedOn?.toISOString() || null,
    currentHours: engine.currentHours ?? null,
    health: engine.health || null,
    lastServicedOn: engine.lastServicedOn?.toISOString() || null,
    nextServiceInHours: engine.nextServiceInHours ?? null,
    oilStatus: engine.oilStatus || null,
    components: engine.components || {},
  })),
  createdAt: mechanical.createdAt?.toISOString(),
  updatedAt: mechanical.updatedAt?.toISOString(),
});

export const createMechanical = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const data = mechanicalSchema.parse(req.body);

    // Ensure one config per boat
    const existing = await Mechanical.findOne({ boatId: data.boatId });
    if (existing) {
      return sendErrorResponse({
        res,
        message: "Mechanical configuration already exists for this boat",
        code: 400,
      });
    }

    const mechanical = await Mechanical.create(data);
    return res.status(201).json(mapMechanicalToResponse(mechanical));
  },
);

export const updateMechanical = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = mechanicalParamsSchema.parse(req.params);
    const data = mechanicalUpdateSchema.parse(req.body);

    const record = await Mechanical.findById(id);
    if (!record)
      return res.status(404).json({ message: "Mechanical record not found" });

    Object.assign(record, data);
    await record.save();

    return res.status(200).json(mapMechanicalToResponse(record));
  },
);

export const getAllMechanical = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const records = await Mechanical.find().sort({ createdAt: -1 });
    return res.status(200).json(records.map(mapMechanicalToResponse));
  },
);

export const getMechanicalById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = mechanicalParamsSchema.parse(req.params);

    const record = await Mechanical.findById(id);
    if (!record)
      return res.status(404).json({ message: "Mechanical record not found" });

    return res.status(200).json(mapMechanicalToResponse(record));
  },
);

export const deleteMechanical = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = mechanicalParamsSchema.parse(req.params);

    const data = await Mechanical.findByIdAndDelete(id);
    if (!data) {
      return sendErrorResponse({ res, message: "Not found", code: 404 });
    }

    sendSuccessResponse({
      res,
      data: {},
      message: "Deleted successfully",
    });
  },
);

export const upsertEngine = catchAsync(async (req: IRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  const { boatId } = upsertEngineParamsSchema.parse(req.params);
  const engineData = engineSchema.parse(req.body);

  const config = await Mechanical.findOne({ boatId });

  if (!config) {
    return sendErrorResponse({
      res,
      message: "Engine config not found",
      code: 404,
    });
  }

  const existingEngine = config.engines.find(
    (e: any) => e.engineSide === engineData.engineSide,
  );

  if (existingEngine) {
    Object.assign(existingEngine, engineData);
  } else {
    config.engines.push(engineData);
  }
  await config.save();

  sendSuccessResponse({ res, data: config });
});

export const deleteMechanicalEngine = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id, engineId } = deleteEngineParamsSchema.parse(req.params);

    const config = await Mechanical.findById(id);
    if (!config) {
      return sendErrorResponse({
        res,
        message: "Engine config not found",
        code: 404,
      });
    }

    const engineExists = config.engines.some(
      (e: any) => e._id.toString() === engineId,
    );
    if (!engineExists) {
      return sendErrorResponse({
        res,
        message: "Engine not found",
        code: 404,
      });
    }

    config.engines = config.engines.filter(
      (e: any) => e._id.toString() !== engineId,
    );

    await config.save();

    sendSuccessResponse({
      res,
      data: config,
      message: "Mechanical engine deleted successfully",
    });
  },
);
