import mongoose from "mongoose";

export interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface IEquipment {
  boatId: mongoose.Types.ObjectId;

  name: string;
  category?: string;
  capacity?: string;

  manufacturer?: string;
  model?: string;

  locationOnBoat?: string;

  installDate?: Date;
  lastServiced?: Date;
  serviceFrequency?: string;

  notes?: string;

  youTubeUrl: string[];

  images: IFile[];
  videos: IFile[];
  documents: IFile[];

  createdBy?: mongoose.Types.ObjectId;
}
