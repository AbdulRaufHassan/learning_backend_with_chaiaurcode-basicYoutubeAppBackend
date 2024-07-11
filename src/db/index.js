import mongoose from "mongoose";
import { env } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionResponse = await mongoose.connect(`${env.DB_URL}`);
    return connectionResponse;
  } catch (error) {
    throw error;
  }
};

export default connectDB;
