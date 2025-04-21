import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.routes";
import todoRouter from "./todo.route";
import passport from "passport";

const routes = Router();

routes.use("/auth", authRouter);
routes.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
routes.use(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  todoRouter
);

export default routes;
