import mongoose from "mongoose";
import customErr from "./customErr";
import { STATUS_CODE_BAD_REQUEST } from "../constants/statusCode";

const ValidateMongoId = (id: string) => {
  const isMongoId = mongoose.isValidObjectId(id);

  if (!isMongoId) {
    return customErr(STATUS_CODE_BAD_REQUEST, "invalid id");
  }
};

export default ValidateMongoId;
