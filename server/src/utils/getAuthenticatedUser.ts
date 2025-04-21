import { Request } from "express-serve-static-core";
import { AuthUser } from "../types/index.type";

export const getAuthenticatedUser = (req: Request) => {
  const user = req.user as AuthUser;
  return user.user;
};
