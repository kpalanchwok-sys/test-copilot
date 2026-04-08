import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import { Equipment } from "../shared/models/equipment";
import {
  equipmentParamsSchema,
  equipmentSchema,
  equipmentUpdateSchema,
} from "../shared/schema/zEquipmentSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapEquipmentToResponse = (equipment: any) => ({
  id: equipment._id?.toString(),

  boatId: equipment.boatId?.toString(),
  name: equipment.name,
  category: equipment.category || "",
  capacity: equipment.capacity || "",
  manufacturer: equipment.manufacturer || "",
  model: equipment.model || "",
  locationOnBoat: equipment.locationOnBoat || "",

  installDate: equipment.installDate ?? null,
  lastServiced: equipment.lastServiced ?? null,
  serviceFrequency: equipment.serviceFrequency || "",

  notes: equipment.notes || "",
  youTubeUrl: equipment.youTubeUrl || [],

  images: equipment.images || [],
  videos: equipment.videos || [],
  documents: equipment.documents || [],
  createdBy: equipment.createdBy?.toString() || null,

  createdAt: equipment.createdAt,
  updatedAt: equipment.updatedAt,
});

export const createEquipment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = equipmentSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const equipment = await Equipment.create(result.data);

    return res.status(201).json(mapEquipmentToResponse(equipment));
  },
);
export const updateEquipment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = equipmentParamsSchema.parse(req.params);
    const validatedData = equipmentUpdateSchema.parse(req.body);

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return sendErrorResponse({
        res,
        message: "Equipment not found",
        code: 404,
      });
    }

    Object.assign(equipment, validatedData);
    await equipment.save();

    return res.status(201).json(mapEquipmentToResponse(equipment));
  },
);

export const getAllEquipment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = await Equipment.find();

    return res.status(200).json(result.map(mapEquipmentToResponse));
  },
);

export const getEquipmentById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = equipmentParamsSchema.parse(req.params);

    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return sendErrorResponse({
        res,
        message: "Equipment not found",
        code: 404,
      });
    }

    return res.status(201).json(mapEquipmentToResponse(equipment));
  },
);

export const deleteEquipment = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = equipmentParamsSchema.parse(req.params);

    const equipment = await Equipment.findByIdAndDelete(id);
    if (!equipment) {
      return sendErrorResponse({
        res,
        message: "Equipment not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Equipment deleted successfully",
    });
  },
);
