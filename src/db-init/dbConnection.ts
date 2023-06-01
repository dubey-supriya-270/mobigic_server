require("dotenv").config({ override: true });
import mongoose from "mongoose";

const mongoURL = process.env["MOBIGIC_MONGO_URL"];
const mongoTestURL = process.env["MOBIGIC_MONGO_TEST_URL"];
export let database: mongoose.Connection;

export const createConnection = () => {
  // URI based on Environment
  const uri = process.env.NODE_ENV == "test" ? mongoTestURL : mongoURL;

  if (database) {
    return;
  }
  mongoose.connect(uri!);
  database = mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database");
  });
  database.on("error", () => {
    console.log("ALERT => Error connecting to database");
  });
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
