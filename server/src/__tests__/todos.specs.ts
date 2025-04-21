import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Todo from "../../src/models/todo.model";
import * as todoController from "../../src/controllers/todo.controller";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants/statusCode";
import customErr from "../utils/customErr";
import ValidateMongoId from "../utils/isValidId";

jest.mock("../models/todo.model");
jest.mock("../utils/getAuthenticatedUser");
// jest.mock("../utils/customErr");
jest.mock("../utils/isValidId", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../utils/customErr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Todo Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const mockUserId = "507f191e810c19729de860ea";
  const mockTodoId = "609e129e82d7e1a530b8b456";

  //  const mockUserId = new mongoose.Types.ObjectId();
  //  const mockTodoId = new mongoose.Types.ObjectId();

  describe("getSingleTodo", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      title: "Test Todo 2",
      description: "Test Description 2",
      reminder: true,
      reminderInterval: "hourly",
      user: mockUserId,
      isDone: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return BAD_REQUEST if todoId is missing", async () => {
      req!.params = {}; // simulate missing todoId

      await todoController.getSingleTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );

      expect(ValidateMongoId).not.toHaveBeenCalled();
    });

    it("should throw error if todoId is wrong(ValidateMongoId fails)", async () => {
      const validateError = new Error("Invalid MongoId");

      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw validateError;
      });

      await todoController.getSingleTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(validateError);

      expect(Todo.findById).not.toHaveBeenCalled();
    });

    it("should return NOT_FOUND if todo is not found", async () => {
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await todoController.getSingleTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);

      expect(customErr).toHaveBeenCalledWith(404, "todo not found");

      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return the todo successfully", async () => {
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);

      await todoController.getSingleTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodo,
      });

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getUserTodos", () => {
    const mockTodos = [
      {
        _id: new mongoose.Types.ObjectId(),
        title: "Test Todo 1",
        description: "Test Description 1",
        reminder: true,
        reminderInterval: "daily",
        user: mockUserId,
        isDone: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: "Test Todo 2",
        description: "Test Description 2",
        reminder: true,
        reminderInterval: "hourly",
        user: mockUserId,
        isDone: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    beforeEach(() => {
      req = {
        query: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should throw error if user is invalid (ValidateMongoId fails)", async () => {
      const validateError = new Error("Invalid MongoId");

      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw validateError;
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(validateError);
      expect(Todo.find).not.toHaveBeenCalled();
    });

    it("should fetch user todos with default offset 0", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);

      expect(Todo.find).toHaveBeenCalledWith({
        user: mockUserId,
        isDeleted: false,
      });
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockTodos });
    });

    it("should apply isDeleted filter from query string", async () => {
      req.query = { isDeleted: "true" };

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(Todo.find).toHaveBeenCalledWith({
        user: mockUserId,
        isDeleted: true,
      });
    });

    it("should apply isDone filter when present", async () => {
      req.query = { isDone: "true" };

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(Todo.find).toHaveBeenCalledWith({
        user: mockUserId,
        isDeleted: false,
        isDone: true,
      });
    });

    it("should apply active filter when present", async () => {
      req.query = { active: "true" };

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValueOnce(mockTodos),
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(Todo.find).toHaveBeenCalledWith({
        user: mockUserId,
        isDeleted: false,
        isDone: false, // since `active: true` means `isDone: false` in your logic
      });
    });

    it("should handle empty todo result and return success", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValueOnce([]),
      });

      await todoController.getUserTodos(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
    });
  });

  describe("Create Todo", () => {
    beforeEach(() => {
      req = {
        body: {
          title: "Test Title",
          description: "Test Description",
          reminder: new Date(),
          reminderInterval: "daily",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should throw error if user is invalid (ValidateMongoId fails)", async () => {
      const validateError = new Error("Invalid MongoId");

      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw validateError;
      });

      await todoController.addNewTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(validateError);
      expect(Todo.create).not.toHaveBeenCalled();
    });

    it("should create a new todo and return 201", async () => {
      const mockCreatedTodo = {
        _id: "609e129e82d7e1a530b8b456",
        title: "Test Title",
        description: "Test Description",
        reminder: new Date(),
        reminderInterval: "daily",
        user: mockUserId,
      };

      (Todo.create as jest.Mock).mockResolvedValueOnce(mockCreatedTodo);

      await todoController.addNewTodo(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(Todo.create).toHaveBeenCalledWith({
        user: mockUserId,
        title: "Test Title",
        description: "Test Description",
        reminder: req.body!.reminder,
        reminderInterval: "daily",
      });
      expect(res!.status).toHaveBeenCalledWith(201);
      expect(res!.json).toHaveBeenCalledWith({
        success: true,
        message: "task added",
        data: mockCreatedTodo,
      });
    });

    it("should create todo even if reminderInterval is not provided", async () => {
      delete req.body!.reminderInterval;

      const mockCreatedTodo = {
        _id: "609e129e82d7e1a530b8b456",
        title: "Test Title",
        description: "Test Description",
        reminder: new Date(),
        user: mockUserId,
      };

      (Todo.create as jest.Mock).mockResolvedValueOnce(mockCreatedTodo);

      await todoController.addNewTodo(req as Request, res as Response, next);

      expect(Todo.create).toHaveBeenCalledWith({
        user: mockUserId,
        title: "Test Title",
        description: "Test Description",
        reminder: req.body!.reminder,
      });

      expect(res!.status).toHaveBeenCalledWith(201);
      expect(res!.json).toHaveBeenCalledWith({
        success: true,
        message: "task added",
        data: mockCreatedTodo,
      });
    });

    it("should call next with error if an exception is thrown", async () => {
      const error = new Error("Unexpected Error");
      (Todo.create as jest.Mock).mockRejectedValueOnce(error);

      await todoController.addNewTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateTodo", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      user: mockUserId,
      title: "Initial Title",
      description: "Initial Desc",
      isDone: false,
      reminderInterval: "daily",
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId },
        body: { title: "Updated Title", isDone: true },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return BAD_REQUEST if todoId is missing", async () => {
      req!.params = {}; // simulate missing todoId

      await todoController.updateTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );
      expect(res!.status).not.toHaveBeenCalled(); // early return
    });

    it("should return NOT_FOUND if todo is not found", async () => {
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await todoController.updateTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);
      expect(customErr).toHaveBeenCalledWith(404, "Todo not found");
      expect(res!.status).not.toHaveBeenCalled();
    });

    it("should return FORBIDDEN if todo does not belong to user", async () => {
      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        user: "aaaaaaaaaaaaaaaaaaaaaaaa",
      });

      await todoController.updateTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        403,
        "you are not permitted to perform this operation"
      );
      expect(Todo.findByIdAndUpdate).not.toHaveBeenCalled(); // no update should happen
    });

    it("should update the todo successfully and return 200", async () => {
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        title: "Updated Title",
        isDone: true,
      });

      await todoController.updateTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);
      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTodoId,
        {
          $set: {
            title: "Updated Title",
            isDone: true,
          },
        },
        { new: true }
      );

      expect(res!.status).toHaveBeenCalledWith(200);
      expect(res!.json).toHaveBeenCalledWith({
        success: true,
        message: "updated",
      });
    });

    it("should call next with error if exception is thrown", async () => {
      const error = new Error("Unexpected Error");
      (Todo.findById as jest.Mock).mockRejectedValueOnce(error);

      await todoController.updateTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("markTodoAsdone", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      user: mockUserId,
      title: "Initial Title",
      description: "Initial Desc",
      isDone: false,
      reminderInterval: "daily",
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId.toString() },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should call customErr if todoId param is missing", async () => {
      req.params = {}; // simulate no todoId in request

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );

      expect(ValidateMongoId).not.toHaveBeenCalledWith(mockUserId);

      expect(ValidateMongoId).not.toHaveBeenCalledWith(expect.anything()); // should not reach second ValidateMongoId
    });

    it("should call next if ValidateMongoId throws for user", async () => {
      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid UserId");
      });

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call next if ValidateMongoId throws for todoId", async () => {
      (ValidateMongoId as jest.Mock)
        .mockImplementationOnce(() => {}) // user validation passes
        .mockImplementationOnce(() => {
          throw new Error("Invalid TodoId");
        }); // todoId validation fails

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId.toString());
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call customErr if the todo does not belong to the user", async () => {
      const anotherUserId = new mongoose.Types.ObjectId();

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        user: anotherUserId,
      });

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_UNAUTHORIZED,
        "you can only update your todo"
      );
    });

    it("should update the todo as done and return success if user is authorized", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(true);

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTodoId.toString(),
        { $set: { isDone: true } }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Done" });
    });

    it("should call next if any unexpected error occurs", async () => {
      const dbError = new Error("Database Failure");

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockRejectedValueOnce(dbError);

      await todoController.markTodoAsdone(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe("toggleReminder", () => {
    beforeEach(() => {
      req = { params: { todoId: mockTodoId } };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
      jest.clearAllMocks();
    });

    it("should call customErr if todoId param is missing", async () => {
      req.params = {}; // simulate no todoId in request

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );

      expect(ValidateMongoId).not.toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).not.toHaveBeenCalledWith(mockTodoId);
    });

    it("should call customErr if todo is not found", async () => {
      (Todo.findById as jest.Mock).mockResolvedValue(null);

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId);
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_NOT_FOUND,
        "Todo not found"
      );
    });

    it("should call customErr if todo does not belong to the user", async () => {
      const fakeTodo = { user: "someOtherUserId", reminder: true };
      (Todo.findById as jest.Mock).mockResolvedValue(fakeTodo);

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId);
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
    });

    it("should toggle reminder off and return success response", async () => {
      const fakeTodo = { user: mockUserId, reminder: true, id: "someTodoId" };

      (Todo.findById as jest.Mock).mockResolvedValue(fakeTodo);

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(fakeTodo.id, {
        $set: { reminder: false },
      });

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Reminder turned off",
      });
    });

    it("should toggle reminder on and return success response", async () => {
      const fakeTodo = { user: mockUserId, reminder: false, id: "someTodoId" };
      (Todo.findById as jest.Mock).mockResolvedValue(fakeTodo);

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(fakeTodo.id, {
        $set: { reminder: true },
      });

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Reminder turned on",
      });
    });

    it("should call next with error on exception", async () => {
      const error = new Error("DB error");
      (Todo.findById as jest.Mock).mockRejectedValue(error);

      await todoController.toggleReminder(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("trashTodo", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      user: mockUserId,
      title: "Initial Title",
      description: "Initial Desc",
      isDone: false,
      reminderInterval: "daily",
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId.toString() },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should call customErr if todoId param is missing", async () => {
      // Arrange
      req.params = {}; // simulate missing `todoId`
      jest.clearAllMocks();

      const error = new Error("todoId is missing");

      // Mock customErr to throw the same error your code expects
      (customErr as unknown as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act
      await todoController.trashTodo(req as Request, res as Response, next);

      // Assert: your customErr was called with expected arguments
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );

      // Assert: the error was passed to express' error handler (next)
      expect(next).toHaveBeenCalledWith(error);

      // Assert: the rest of the logic did not run
      expect(ValidateMongoId).not.toHaveBeenCalled();
      expect(Todo.findById).not.toHaveBeenCalled();
    });

    // it("should call customErr if todoId param is missing", async () => {
    //   req.params = {}; // simulate missing `todoId`

    //   await todoController.trashTodo(req as Request, res as Response, next);

    //   expect(customErr).toHaveBeenCalledWith(
    //     STATUS_CODE_BAD_REQUEST,
    //     "todoId is missing"
    //   );

    //   // expect(ValidateMongoId).not.toHaveBeenCalled();
    //   // expect(Todo.findById).not.toHaveBeenCalled();
    // });

    it("should call next if ValidateMongoId throws for user", async () => {
      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid UserId");
      });

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call next if ValidateMongoId throws for todoId", async () => {
      (ValidateMongoId as jest.Mock)
        .mockImplementationOnce(() => {}) // user validation
        .mockImplementationOnce(() => {
          throw new Error("Invalid TodoId");
        }); // todoId validation

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId.toString());
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call customErr if Todo is not found", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId.toString());
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_NOT_FOUND,
        "Todo not found"
      );
    });

    it("should block if todo does not belong to the user", async () => {
      const anotherUserId = new mongoose.Types.ObjectId();

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        user: anotherUserId,
      });

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
    });

    it("should mark the todo as deleted and return success if user is authorized", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(true);

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(mockTodo.id, {
        isDeleted: true,
      });
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "deleted",
      });
    });

    it("should call next with error if something unexpected happens", async () => {
      const fakeError = new Error("Unexpected DB failure");
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockRejectedValueOnce(fakeError);

      await todoController.trashTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  describe("restoreTodo", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      user: mockUserId,
      title: "Restored Title",
      description: "Restored Desc",
      isDone: false,
      reminderInterval: "daily",
      isDeleted: true, // Marked as deleted initially
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId.toString() },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should call customErr if todoId param is missing", async () => {
      req.params = {}; // simulate missing `todoId`

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );

      expect(ValidateMongoId).not.toHaveBeenCalled();
      expect(Todo.findById).not.toHaveBeenCalled();
    });

    it("should call next if ValidateMongoId throws for user", async () => {
      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid UserId");
      });

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call next if ValidateMongoId throws for todoId", async () => {
      (ValidateMongoId as jest.Mock)
        .mockImplementationOnce(() => {}) // user validation
        .mockImplementationOnce(() => {
          throw new Error("Invalid TodoId");
        }); // todoId validation

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId.toString());
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call customErr if Todo is not found", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId.toString());
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_NOT_FOUND,
        "Todo not found"
      );
    });

    it("should call customErr if Todo is not marked as deleted", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        isDeleted: false, // Already not deleted
      });

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "This task is not deleted"
      );
    });

    it("should call customErr if Todo does not belong to the user", async () => {
      const anotherUserId = new mongoose.Types.ObjectId();

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        user: anotherUserId,
      });

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
    });

    it("should restore the todo and return success if user is authorized", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);
      (Todo.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(true);

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTodo.id,
        {
          $set: { isDeleted: false },
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "task restored",
      });
    });

    it("should call next with error if something unexpected happens", async () => {
      const fakeError = new Error("Unexpected DB failure");
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockRejectedValueOnce(fakeError);

      await todoController.restoreTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });

  describe("deleteTodo", () => {
    const mockTodo = {
      _id: mockTodoId,
      id: mockTodoId,
      user: mockUserId,
      title: "Initial Title",
      description: "Initial Desc",
      isDone: false,
      reminderInterval: "daily",
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockTodoId.toString() },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();

      (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUserId);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return an error if todoId param is missing", async () => {
      req.params = {}; // Simulate missing `todoId`

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "todoId is missing"
      );
      expect(ValidateMongoId).not.toHaveBeenCalled();
      expect(Todo.findById).not.toHaveBeenCalled();
    });

    it("should call customErr if ValidateMongoId throws for user", async () => {
      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Invalid UserId");
      });

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call customErr if ValidateMongoId throws for todoId", async () => {
      // First call passes for user
      (ValidateMongoId as jest.Mock)
        .mockImplementationOnce(() => {}) // user check
        .mockImplementationOnce(() => {
          // todoId check
          throw new Error("Invalid TodoId");
        });

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockTodoId.toString());
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should call customErr if todo is not found", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(null);

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(Todo.findById).toHaveBeenCalledWith(mockTodoId.toString());
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_NOT_FOUND,
        "Todo not found"
      );
    });

    it("should block deletion if todo does not belong to the user", async () => {
      const anotherUserId = new mongoose.Types.ObjectId();

      (ValidateMongoId as jest.Mock).mockImplementation(() => {});

      (Todo.findById as jest.Mock).mockResolvedValueOnce({
        ...mockTodo,
        user: anotherUserId,
      });

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "You're not allowed to perform this operation"
      );
    });

    it("should delete todo and return success if user is authorized", async () => {
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockResolvedValueOnce(mockTodo);
      (Todo.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(true);

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(mockTodo.id);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "deleted",
      });
    });

    it("should call next with error if something unexpected throws", async () => {
      const fakeError = new Error("unexpected failure");
      (ValidateMongoId as jest.Mock).mockImplementation(() => {});
      (Todo.findById as jest.Mock).mockRejectedValueOnce(fakeError);

      await todoController.deleteTodo(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(fakeError);
    });
  });
});
