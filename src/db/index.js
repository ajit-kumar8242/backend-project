import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connectionInstances = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
    console.log(
      `MongoDB establish connect HOST:${connectionInstances.connection.host}`,
    );
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};
export default connectDB;
