import mongoose from "mongoose";
import { IUserFiles } from "../../interfaces/userFiles";

//Defining userFiles model
let user = new mongoose.Schema<IUserFiles>({
  uniqueCode: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  uploadAt: { type: Date },
});

//exporting UserFiles schema
export const UserFiles = mongoose.model("userFiles", user);
