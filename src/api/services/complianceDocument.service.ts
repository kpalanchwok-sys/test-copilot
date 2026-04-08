import mongoose from "mongoose";
import { IFile } from "../shared/interfaces/IBoat";
import ComplianceDocument, {
  IComplianceDocument,
  IYouTubeLink,
} from "../shared/models/complianceDocument";
import { SingleDocumentParams } from "../shared/schema/zComplianceDocumentSchema";
import { AppError } from "../utils/AppError";

type WithId<T> = T & { _id: mongoose.Types.ObjectId };

type FoundSingleComplianceDocumentItem =
  | { type: "image"; item: WithId<IFile> }
  | { type: "video"; item: WithId<IFile> }
  | { type: "document"; item: WithId<IFile> }
  | { type: "youtube"; item: WithId<IYouTubeLink> };

const findTheItem = (
  complianceDoc: IComplianceDocument,
  documentId: string,
): FoundSingleComplianceDocumentItem | null => {
  const hasId = (value: { _id?: mongoose.Types.ObjectId }) =>
    value._id?.toString() === documentId;

  const image = complianceDoc.images.find((x) => hasId(x as WithId<IFile>));
  if (image) return { type: "image", item: image as WithId<IFile> };

  const video = complianceDoc.videos.find((x) => hasId(x as WithId<IFile>));
  if (video) return { type: "video", item: video as WithId<IFile> };

  const doc = complianceDoc.documents.find((x) => hasId(x as WithId<IFile>));
  if (doc) return { type: "document", item: doc as WithId<IFile> };

  const youtube = complianceDoc.youTubeLinks?.find((x) =>
    hasId(x as WithId<IYouTubeLink>),
  );
  if (youtube)
    return { type: "youtube", item: youtube as WithId<IYouTubeLink> };

  return null;
};

export const getSingleComplianceDocumentService = async ({
  complianceDocumentId,
  documentId,
  userId,
}: SingleDocumentParams & {
  userId: string;
}): Promise<FoundSingleComplianceDocumentItem> => {
  try {
    const complianceDoc = await ComplianceDocument.findOne({
      _id: complianceDocumentId,
      createdBy: userId,
    });

    if (!complianceDoc) {
      throw new AppError(404, "Compliance document not found");
    }

    const foundItem = findTheItem(complianceDoc, documentId);

    if (foundItem) {
      return foundItem;
    }

    throw new AppError(
      404,
      "Requested item not found in this compliance record",
    );
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Internal server error");
  }
};

export const deleteSingleComplianceDocumentService = async ({
  complianceDocumentId,
  documentId,
  userId,
}: SingleDocumentParams & {
  userId: string;
}): Promise<FoundSingleComplianceDocumentItem> => {
  try {
    const complianceDoc = await ComplianceDocument.findOne({
      _id: complianceDocumentId,
      createdBy: userId,
    });

    if (!complianceDoc) {
      throw new AppError(404, "Compliance document not found");
    }

    const foundItem = findTheItem(complianceDoc, documentId);

    if (!foundItem) {
      throw new AppError(
        404,
        "Requested item not found in this compliance record",
      );
    }

    const itemObjectId = new mongoose.Types.ObjectId(documentId);
    const update: Record<string, unknown> =
      foundItem.type === "image"
        ? { $pull: { images: { _id: itemObjectId } } }
        : foundItem.type === "video"
          ? { $pull: { videos: { _id: itemObjectId } } }
          : foundItem.type === "document"
            ? { $pull: { documents: { _id: itemObjectId } } }
            : { $pull: { youTubeLinks: { _id: itemObjectId } } };

    await ComplianceDocument.updateOne(
      {
        _id: complianceDocumentId,
        createdBy: userId,
      },
      update,
    );

    return foundItem;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Internal server error");
  }
};
