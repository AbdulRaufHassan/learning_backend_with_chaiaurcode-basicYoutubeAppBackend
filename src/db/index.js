import mongoose from "mongoose";

const connectDB = async () => {
  try {
   const connectionResponse = await mongoose.connect(`${process.env.DB_URL}`);
   console.log("connection response ==========>",connectionResponse)
  } catch (error) {
    throw error
  }
};

export default connectDB