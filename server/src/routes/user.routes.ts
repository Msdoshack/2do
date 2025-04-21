import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateEmail,
  updateUser,
  verifyEmail,
} from "../controllers/user.controller";
import passport from "passport";
import isAdmin from "../middlewares/isAdmin.middleware";
import { checkSchema } from "express-validator";
import { updateUserValidation } from "../validationSchemas/user/user.validation";
import validate from "../middlewares/validate.middleware";
import { updateEmailValidation } from "../validationSchemas/user/updateEmail.validation";
import { verifyEmailValidation } from "../validationSchemas/user/verifyEmail.validation";
import { changePasswordValidation } from "../validationSchemas/user/changePassword.validation";

const userRouter = Router();

userRouter.get("/", isAdmin, getAllUsers);

userRouter.get(
  "/single-user",

  getSingleUser
);

userRouter.post(
  "/verify-email",
  checkSchema(verifyEmailValidation),
  validate,
  verifyEmail
);

userRouter.patch(
  "/update-email",
  checkSchema(updateEmailValidation),
  updateEmail
);

userRouter.patch(
  "/change-password",
  checkSchema(changePasswordValidation),
  validate,
  changePassword
);

userRouter.put(
  "/:userId",
  checkSchema(updateUserValidation),
  validate,
  updateUser
);

userRouter.delete("/:id", isAdmin, deleteUser);

export default userRouter;
