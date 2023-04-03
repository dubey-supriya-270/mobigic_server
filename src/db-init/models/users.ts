import mongoose from "mongoose";
import { IUser } from "../../interfaces/user";

//Defining user model
let user = new mongoose.Schema<IUser>(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//exporting User schema
export const Users = mongoose.model("users", user);
