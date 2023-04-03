import { Types } from "mongoose";

export interface IUserFiles extends Document {
  uniqueCode: string;
  fileUrl: string;
  userId: Types.ObjectId;
  fileName: string;
  uploadAt: Date;
}

export interface IUserCreateFiles {
  userId: string;
  uniqueCode: string;
  fileUrl: string;
  fileName: string;
}
