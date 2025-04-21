import { Request, Response, NextFunction } from "express-serve-static-core";
import customErr from "../utils/customErr";
import { AuthUser } from "../types/index.type";
import {
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants/statusCode";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as AuthUser;
    if (!user) {
      customErr(STATUS_CODE_UNAUTHORIZED, "Unauthorized");
      return;
    }

    if (user.role !== "admin") {
      customErr(STATUS_CODE_FORBIDDEN, "You dont have access to this route");
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default isAdmin;
