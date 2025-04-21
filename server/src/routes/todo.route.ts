import { Router } from "express";
import {
  addNewTodo,
  deleteTodo,
  getAllTodos,
  getSingleTodo,
  getUserTodos,
  markTodoAsdone,
  restoreTodo,
  toggleReminder,
  trashTodo,
  updateTodo,
} from "../controllers/todo.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import { checkSchema } from "express-validator";
import {
  addTodoValidation,
  updateTodoValidation,
} from "../validationSchemas/todo/todo.validation";
import validate from "../middlewares/validate.middleware";

const todoRouter = Router();

todoRouter.get("/", isAdmin, getAllTodos);

todoRouter.get("/:todoId", getSingleTodo);

todoRouter.get("/user/todo", getUserTodos);

todoRouter.post("/", checkSchema(addTodoValidation), validate, addNewTodo);

todoRouter.put(
  "/:todoId",
  checkSchema(updateTodoValidation),
  validate,
  updateTodo
);

todoRouter.put("/mark-done/:todoId", markTodoAsdone);

todoRouter.put("/toggle-reminder/:todoId", toggleReminder);
todoRouter.put("/restore-todo/:todoId", restoreTodo);

todoRouter.delete("/trash/:todoId", trashTodo);

todoRouter.delete("/:todoId", deleteTodo);

export default todoRouter;
