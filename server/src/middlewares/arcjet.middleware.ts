import aj from "../config/arcjet";
import { Request, Response, NextFunction } from "express-serve-static-core";
import {
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_TOO_MANY_REQUEST,
} from "../constants/statusCode";

const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res
          .status(STATUS_CODE_TOO_MANY_REQUEST)
          .json({ message: "Rate limit exceeded" });
        return;
      }
      if (decision.reason.isBot()) {
        res.status(STATUS_CODE_FORBIDDEN).json({ message: "Bot detected" });
        return;
      }

      res.status(STATUS_CODE_FORBIDDEN).json({ error: "Access denied" });
      return;
    }

    next();
  } catch (error) {
    console.log(`arcject middleware error ${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
