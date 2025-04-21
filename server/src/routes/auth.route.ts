import { Router } from "express";
import {
  passwordCheck,
  signIn,
  signUp,
  verifySignUp,
} from "../controllers/auth.controller";
import { checkSchema } from "express-validator";
import {
  passwordCheckValidation,
  signInValidation,
  signUpValidation,
  verifySignUpValidation,
} from "../validationSchemas/auth/auth.validation";
import validate from "../middlewares/validate.middleware";
import passport from "passport";

const authRouter = Router();

authRouter.post("/sign-up", checkSchema(signUpValidation), validate, signUp);

authRouter.post(
  "/verify-sign-up",
  checkSchema(verifySignUpValidation),
  validate,
  verifySignUp
);

authRouter.post("/sign-in", checkSchema(signInValidation), validate, signIn);

authRouter.post(
  "/password-check",
  checkSchema(passwordCheckValidation),
  validate,
  passport.authenticate("jwt", { session: false }),
  passwordCheck
);

export default authRouter;
