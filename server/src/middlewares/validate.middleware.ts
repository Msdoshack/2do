import { NextFunction, Request, Response } from "express-serve-static-core";
import { validationResult } from "express-validator";
import customErr from "../utils/customErr";
import { STATUS_CODE_BAD_REQUEST } from "../constants/statusCode";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  const errMsgs = errors.array().map((err) => " " + err.msg);

  if (!errors.isEmpty()) {
    customErr(STATUS_CODE_BAD_REQUEST, `${errMsgs}`);
    return;
  }

  next();
};

export default validate;
