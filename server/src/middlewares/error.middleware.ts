import { NextFunction, Response, Request } from "express";
import { CustomErrorType } from "../types/index.type";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERR,
  STATUS_CODE_NOT_FOUND,
} from "../constants/statusCode";

const errorMiddleware = (
  err: CustomErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };

    error.message = err.message;
    console.error(err);

    // Mongoose bad object error

    if (error.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = STATUS_CODE_NOT_FOUND;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = STATUS_CODE_BAD_REQUEST;
    }

    // Mongoose validation error

    if (err.name === "ValidationError" && err.errors) {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = STATUS_CODE_BAD_REQUEST;
    }

    res
      .status(error.statusCode || STATUS_CODE_INTERNAL_SERVER_ERR)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
