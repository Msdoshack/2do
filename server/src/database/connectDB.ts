import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

if (!DB_URI) {
  throw new Error(
    "Please define the mongo db uri inside.env.<development.production>.local"
  );
}

const connectToDataBase = async () => {
  try {
    await mongoose.connect(DB_URI!);
    console.log(`connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectToDataBase;
