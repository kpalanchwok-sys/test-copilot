import { Response } from "express";
import {
  deleteSingleComplianceDocumentService,
  getSingleComplianceDocumentService,
} from "../services/complianceDocument.service";
import { IRequest } from "../shared/interfaces/IRequest";
import ComplianceDocument from "../shared/models/complianceDocument";
import {
  complianceDocumentParamsSchema,
  complianceDocumentSchema,
  complianceDocumentUpdateSchema,
  singleDocumentParamsSchema,
} from "../shared/schema/zComplianceDocumentSchema";
import { catchAsync } from "../utils/catchAsync";

const formatComplianceDocumentResponse = (complianceDocument: any) => ({
  id: complianceDocument.id,
  boatId: complianceDocument.boatId,
  youTubeLink: complianceDocument.youTubeLink,
  images: complianceDocument.images || [],
  videos: complianceDocument.videos || [],
  documents: complianceDocument.documents || [],
  createdBy: complianceDocument.createdBy,
});

export const createComplianceDocument = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const body = complianceDocumentSchema.parse(req.body);

    const complianceDocument = await ComplianceDocument.create({
      ...body,
      createdBy: userId,
    });

    return res
      .status(201)
      .json(formatComplianceDocumentResponse(complianceDocument));
  },
);

export const getAllComplianceDocuments = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const complianceDocuments = await ComplianceDocument.find({
      createdBy: userId,
    });

    return res.status(200).json(complianceDocuments);
  },
);

export const getSingleComplianceDocument = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const { complianceDocumentId, documentId } =
      singleDocumentParamsSchema.parse(req.params);

    const document = await getSingleComplianceDocumentService({
      complianceDocumentId,
      documentId,
      userId: userId ?? "",
    });

    return res.status(200).json(document);
  },
);

export const deleteSingleComplianceDocument = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();

    const { complianceDocumentId, documentId } =
      singleDocumentParamsSchema.parse(req.params);

    const deletedItem = await deleteSingleComplianceDocumentService({
      complianceDocumentId,
      documentId,
      userId: userId ?? "",
    });

    return res.status(200).json({
      message: "Item deleted successfully",
      data: deletedItem,
    });
  },
);

export const getComplianceDocumentById = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { complianceDocumentId } = complianceDocumentParamsSchema.parse(
      req.params,
    );

    const complianceDocument = await ComplianceDocument.findOne({
      _id: complianceDocumentId,
      createdBy: userId,
    });

    if (!complianceDocument) {
      return res.status(404).json({ message: "Compliance document not found" });
    }

    return res
      .status(200)
      .json(formatComplianceDocumentResponse(complianceDocument));
  },
);

export const updateComplianceDocument = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { complianceDocumentId } = complianceDocumentParamsSchema.parse(
      req.params,
    );
    const body = complianceDocumentUpdateSchema.parse(req.body);

    const complianceDocument = await ComplianceDocument.findOneAndUpdate(
      { _id: complianceDocumentId, createdBy: userId },
      { $set: body },
      { new: true },
    );

    if (!complianceDocument) {
      return res.status(404).json({ message: "Compliance document not found" });
    }

    return res
      .status(200)
      .json(formatComplianceDocumentResponse(complianceDocument));
  },
);

export const deleteComplianceDocument = catchAsync(
  async (req: IRequest, res: Response) => {
    const userId = req.user?._id?.toString();
    const { complianceDocumentId } = complianceDocumentParamsSchema.parse(
      req.params,
    );

    const complianceDocument = await ComplianceDocument.findOneAndDelete({
      _id: complianceDocumentId,
      createdBy: userId,
    });

    if (!complianceDocument) {
      return res.status(404).json({ message: "Compliance document not found" });
    }

    return res.status(200).json({
      message: "Compliance document deleted successfully",
    });
  },
);
