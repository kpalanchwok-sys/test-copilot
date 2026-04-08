import mongoose from "mongoose";

export interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize?: number;
  status: string;
}

export interface IBoat {
  boatName: string;
  registrationNumber: string;
  type?: string;
  make?: string;
  model?: string;
  serialNumber?: string;
  year?: string;

  length?: string;
  beam?: number;
  draft?: number;
  airDraft?: number;

  homeMarina?: string;
  mooringLocation?: string;

  status?: "Active" | "Inactive" | "Maintenance" | "Sold";

  ownerName?: string;
  contactEmail?: string;

  images: IFile[];
  documents: IFile[];

  createdBy?: mongoose.Types.ObjectId;
}
