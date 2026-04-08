import { Response } from "express";
import { IRequest } from "../shared/interfaces/IRequest";
import EmergencyContact from "../shared/models/emergencyContact";
import {
  contactParamsSchema,
  contactUpdateSchema,
  emergencyContactSchema,
} from "../shared/schema/zemergencyContactSchema";
import { catchAsync } from "../utils/catchAsync";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHandler";

const mapEmergencyContactToResponse = (contact: any) => ({
  id: contact._id?.toString(),

  name: contact.name,
  relationship: contact.relationship,
  mobileNumber: contact.mobileNumber,

  createdAt: contact.createdAt,
  updatedAt: contact.updatedAt,
});

export const createEmergencyContact = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const result = emergencyContactSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    const contact = await EmergencyContact.create(result.data);

    return res.status(201).json(mapEmergencyContactToResponse(contact));
  },
);

export const updateEmergencyContact = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = contactParamsSchema.parse(req.params);
    const validatedData = contactUpdateSchema.parse(req.body);

    const contact = await EmergencyContact.findById(id);

    if (!contact) {
      return sendErrorResponse({
        res,
        message: "Contact not found",
        code: 404,
      });
    }

    // Prevent duplicate mobile number
    if (req.body.mobileNumber) {
      const existing = await EmergencyContact.findOne({
        mobileNumber: req.body.mobileNumber,
        _id: { $ne: id },
      });

      if (existing) {
        return sendErrorResponse({
          res,
          message: "Another contact already uses this mobile number",
          code: 400,
        });
      }
    }

    Object.assign(contact, validatedData);
    await contact.save();

    sendSuccessResponse({
      res,
      data: mapEmergencyContactToResponse(contact),
    });
  },
);

export const getAllEmergencyContacts = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const contacts = await EmergencyContact.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(contacts.map(mapEmergencyContactToResponse));
  },
);

export const getEmergencyContactById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = contactParamsSchema.parse(req.params);

    const contact = await EmergencyContact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json(mapEmergencyContactToResponse(contact));
  },
);

export const deleteEmergencyContact = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { id } = contactParamsSchema.parse(req.params);

    const contact = await EmergencyContact.findByIdAndDelete(id);

    if (!contact) {
      return sendErrorResponse({
        res,
        message: "Contact not found",
        code: 404,
      });
    }

    sendSuccessResponse({
      data: {},
      res,
      message: "Contact deleted successfully",
    });
  },
);
