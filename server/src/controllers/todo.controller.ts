import { NextFunction, Request, Response } from "express-serve-static-core";
import Todo from "../models/todo.model";
import customErr from "../utils/customErr";
import ValidateMongoId from "../utils/isValidId";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_CREATED,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants/statusCode";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import CreateTodoDto from "../dtos/createTodo.dto";
import UpdateTodoDto from "../dtos/updateTodo.dto";
import { TodoIdParam } from "../types/index.type";

export const getAllTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await Todo.find({});

    res.status(STATUS_CODE_OK).json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

export const getSingleTodo = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    ValidateMongoId(todoId);

    const todo = await Todo.findById(todoId);

    if (!todo) {
      customErr(STATUS_CODE_NOT_FOUND, "todo not found");
      return;
    }

    res.status(STATUS_CODE_OK).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const getUserTodos = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { isDeleted, isDone, active } = req.query;

    const limit = 10;
    const offset = Number(req.query.offset) || 0;

    ValidateMongoId(user);
    const isDel = isDeleted === "true" ? true : false;

    const userTodo = await Todo.find({
      user,
      isDeleted: isDel,
      ...(isDone && { isDone: Boolean(isDone) }),
      ...(active && { isDone: Boolean(!active) }),
    })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(offset);

    res.status(STATUS_CODE_OK).json({ success: true, data: userTodo });
  } catch (error) {
    next(error);
  }
};

export const addNewTodo = async (
  req: Request<{}, {}, CreateTodoDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, reminder, reminderInterval /* deadline */ } =
      req.body;

    const user = getAuthenticatedUser(req);

    ValidateMongoId(user);

    const todoData: any = { user, title, description, reminder };

    if (reminderInterval) {
      todoData.reminderInterval = reminderInterval;
    }

    // if (deadline) {
    //   todoData.deadline = deadline;
    // }

    const addTodo = await Todo.create(todoData);

    res
      .status(STATUS_CODE_CREATED)
      .json({ success: true, message: "task added", data: addTodo });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request<{}, {}, UpdateTodoDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);

    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    const { title, description, isDone, /* deadline, */ reminderInterval } =
      req.body;

    const findTodo = await Todo.findById(todoId);

    if (!findTodo) {
      customErr(STATUS_CODE_NOT_FOUND, "Todo not found");
      return;
    }

    if (JSON.stringify(findTodo.user) !== JSON.stringify(user)) {
      customErr(
        STATUS_CODE_FORBIDDEN,
        "you are not permitted to perform this operation"
      );
      return;
    }

    await Todo.findByIdAndUpdate(
      findTodo.id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          // ...(deadline && { deadline }),
          ...(isDone !== undefined && { isDone }),
          ...(reminderInterval && { reminderInterval }),
        },
      },
      { new: true }
    );

    res.status(STATUS_CODE_OK).json({ success: true, message: "updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    ValidateMongoId(user);
    ValidateMongoId(todoId);

    const findTodo = await Todo.findById(todoId);

    if (!findTodo) {
      customErr(STATUS_CODE_NOT_FOUND, "Todo not found");
      return;
    }

    if (JSON.stringify(findTodo.user) != JSON.stringify(user)) {
      customErr(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
      return;
    }

    await Todo.findByIdAndDelete(findTodo.id);

    res.status(STATUS_CODE_OK).json({ success: true, message: "deleted" });
  } catch (error) {
    next(error);
  }
};

export const trashTodo = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);

    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    ValidateMongoId(user);
    ValidateMongoId(todoId);

    const findTodo = await Todo.findById(todoId);

    if (!findTodo) {
      customErr(STATUS_CODE_NOT_FOUND, "Todo not found");
      return;
    }

    if (JSON.stringify(findTodo.user) != JSON.stringify(user)) {
      customErr(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
      return;
    }

    await Todo.findByIdAndUpdate(findTodo.id, { isDeleted: true });

    res.status(STATUS_CODE_OK).json({ success: true, message: "deleted" });
  } catch (error) {
    next(error);
  }
};

export const markTodoAsdone = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { todoId } = req.params as TodoIdParam;
    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    ValidateMongoId(user);
    ValidateMongoId(todoId);

    const todo = await Todo.findById(todoId);

    if (JSON.stringify(todo?.user) != JSON.stringify(user)) {
      customErr(STATUS_CODE_UNAUTHORIZED, "you can only update your todo");
      return;
    }

    await Todo.findByIdAndUpdate(todoId, { $set: { isDone: true } });

    res.status(200).json({ success: true, message: "Done" });
  } catch (error) {
    next(error);
  }
};

export const toggleReminder = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    const user = getAuthenticatedUser(req);

    ValidateMongoId(user);
    ValidateMongoId(todoId);

    const findTodo = await Todo.findById(todoId);

    const message =
      findTodo?.reminder === true
        ? "Reminder turned off"
        : "Reminder turned on";

    if (!findTodo) {
      customErr(STATUS_CODE_NOT_FOUND, "Todo not found");
      return;
    }

    if (JSON.stringify(findTodo.user) != JSON.stringify(user)) {
      customErr(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
      return;
    }

    await Todo.findByIdAndUpdate(findTodo.id, {
      $set: {
        reminder: !findTodo.reminder,
      },
    });

    res.status(STATUS_CODE_OK).json({ success: true, message: message });
  } catch (error) {
    next(error);
  }
};

export const restoreTodo = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { todoId } = req.params as TodoIdParam;

    if (!todoId) {
      customErr(STATUS_CODE_BAD_REQUEST, "todoId is missing");
      return;
    }

    ValidateMongoId(user);
    ValidateMongoId(todoId);

    const findTodo = await Todo.findById(todoId);

    if (!findTodo) {
      customErr(STATUS_CODE_NOT_FOUND, "Todo not found");
      return;
    }

    if (!findTodo.isDeleted) {
      customErr(STATUS_CODE_FORBIDDEN, "This task is not deleted");
      return;
    }

    if (JSON.stringify(findTodo.user) != JSON.stringify(user)) {
      customErr(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
      return;
    }

    await Todo.findByIdAndUpdate(
      findTodo.id,
      {
        $set: {
          isDeleted: false,
        },
      },
      { new: true }
    );

    res
      .status(STATUS_CODE_OK)
      .json({ success: true, message: "task restored" });
  } catch (error) {
    next(error);
  }
};
