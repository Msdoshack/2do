import { NextFunction, Request, Response } from "express-serve-static-core";
import ValidateMongoId from "../utils/isValidId";
import customErr from "../utils/customErr";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import * as userController from "../controllers/user.controller";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_OK,
} from "../constants/statusCode";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

jest.mock("../models/user.model");
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

jest.mock("../utils/getAuthenticatedUserRole");

jest.mock("bcryptjs");

describe("User controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const mockUserId = "507f191e810c19729de860ea";

  describe("getAllUsers", () => {
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return all users when called by an admin", async () => {
      const fakeUsers = [{ name: "User1" }, { name: "User2" }];

      req.user = { role: "admin" } as any;

      (User.find as jest.Mock).mockResolvedValueOnce(fakeUsers);

      await userController.getAllUsers(req as Request, res as Response, next);

      expect(User.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeUsers,
      });
    });

    it("should block access for non-admin users", async () => {
      const mockReq = {
        user: { user: mockUserId, role: "user" }, // This needs to be set correctly in the test
      } as Partial<Request>;

      const isAdmin = require("../middlewares/isAdmin.middleware").default;

      const mockNext = jest.fn();
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "You dont have access to this route"
      );
    });

    it("should throw error when user is not authenticated", () => {
      const mockReq = { user: undefined } as Partial<Request>;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const mockNext = jest.fn();

      const isAdmin = require("../middlewares/isAdmin.middleware").default;

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(customErr).toHaveBeenCalledWith(401, "Unauthorized");
    });

    it("should handle errors from User.find()", async () => {
      const error = new Error("Database failure");
      req.user = { role: "admin" } as any;

      (User.find as jest.Mock).mockRejectedValueOnce(error);

      await userController.getAllUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("Get SingleUser", () => {
    const mockUser = {
      _id: mockUserId,
      id: mockUserId,
      username: "msdos",
      email: "msdosdarapper@gmail.com",
      password: "12345",
    };

    beforeEach(() => {
      req = {
        params: { todoId: mockUserId },
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

    it("should return user successfully", async () => {
      const mockUserData = {
        _id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
      };

      const selectMock = jest.fn().mockResolvedValueOnce(mockUserData);
      (User.findById as jest.Mock).mockReturnValueOnce({ select: selectMock });

      await userController.getSingleUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUserData,
      });
    });

    it("should call customErr if user is not found", async () => {
      const error = new Error("User Not Found");

      (User.findById as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(null),
      });

      (customErr as unknown as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      await userController.getSingleUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);

      expect(customErr).toHaveBeenCalledWith(404, "User Not Found");
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should call next with error if ValidateMongoId throws", async () => {
      const validationError = new Error("invalid id");
      (ValidateMongoId as jest.Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      await userController.getSingleUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(next).toHaveBeenCalledWith(validationError);
      expect(User.findById).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should pass unknown errors to next()", async () => {
      const unexpectedError = new Error("Unexpected");
      (User.findById as jest.Mock).mockImplementationOnce(() => {
        throw unexpectedError;
      });

      await userController.getSingleUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(unexpectedError);
    });
  });

  describe("Update User", () => {
    beforeEach(() => {
      req = {
        params: { userId: mockUserId },
        body: { username: "updatedUser" },
        user: { user: mockUserId }, // mock authenticated user
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

    it("should throw BAD_REQUEST if userId is missing in params", async () => {
      req!.params = {}; // simulate missing userId

      await userController.updateUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(customErr).toHaveBeenCalledWith(
        400,
        "userId is missing from params"
      );
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized if userId does not match authenticated user", async () => {
      req!.params = { userId: "differentUserId" }; // mismatch!

      await userController.updateUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(customErr).toHaveBeenCalledWith(404, "Unauthorized");
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should call findByIdAndUpdate and return success if input is valid", async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        _id: mockUserId,
        username: "updatedUser",
      });

      await userController.updateUser(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(ValidateMongoId).toHaveBeenCalledWith(mockUserId);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUserId,
        { $set: { username: "updatedUser" } },
        { new: true }
      );
      expect(res!.status).toHaveBeenCalledWith(200);
      expect(res!.json).toHaveBeenCalledWith({
        success: true,
        message: "info updated",
      });
    });

    it("should call next with error if an exception is thrown", async () => {
      const mockError = new Error("unexpected failure");
      (User.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(mockError);

      await userController.updateUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe("Change Password", () => {
    beforeEach(() => {
      req = {
        body: {
          password: "oldPassword",
          newPassword: "newPassword123",
        },
        user: { user: mockUserId },
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

    it("should call customErr with NOT_FOUND if user is not found", async () => {
      (User.findById as jest.Mock).mockResolvedValueOnce(null);

      await userController.changePassword(
        req as Request,
        res as Response,
        next
      );

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_NOT_FOUND,
        "user not found"
      );
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should call customErr with FORBIDDEN if passwords don't match", async () => {
      const fakeUser = { password: "hashedOldPassword" };
      (User.findById as jest.Mock).mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await userController.changePassword(
        req as Request,
        res as Response,
        next
      );

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "oldPassword",
        fakeUser.password
      );
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_FORBIDDEN,
        "wrong password"
      );
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should hash new password, update user and return success response", async () => {
      const mockSave = jest.fn().mockResolvedValueOnce(true);
      const fakeUser = { password: "hashedOldPassword", save: mockSave };

      (User.findById as jest.Mock).mockResolvedValueOnce(fakeUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce("mockSalt");
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedNewPassword");

      await userController.changePassword(
        req as Request,
        res as Response,
        next
      );

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "oldPassword",
        "hashedOldPassword"
      );
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", "mockSalt");
      expect(fakeUser.password).toBe("hashedNewPassword");
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "password changed",
      });
    });

    it("should call next with error if an exception is thrown", async () => {
      const error = new Error("unexpected failure");
      (User.findById as jest.Mock).mockRejectedValueOnce(error);

      await userController.changePassword(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("Update Email", () => {
    beforeEach(() => {
      req = {
        body: { code: "1234" },
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

    it("should update email and return success response", async () => {
      const fakeUser = {
        id: mockUserId,
        tempE: "newEmail@example.com",
        email: "msdos@gmail.com",
        vCode: "1234",
        save: jest.fn().mockImplementation(),
      };

      // Mock User.findOne to return the fake user
      (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);

      // Call the controller function
      await userController.updateEmail(req as Request, res as Response, next);

      expect(fakeUser.email).toBe("newEmail@example.com"); // Ensure email is updated
      expect(fakeUser.tempE).toBe(""); // Ensure tempE is cleared

      // Check that save was called
      expect(fakeUser.save).toHaveBeenCalled(); // Ensure save was called

      // Check the response status and message
      expect(res.status).toHaveBeenCalledWith(STATUS_CODE_OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "email changed",
      });
    });

    it("should throw error if user with code is not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await userController.updateEmail(req as Request, res as Response, next);

      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(User.findOne).toHaveBeenCalledWith({ vCode: "1234" });
      expect(customErr).toHaveBeenCalledWith(400, "Wrong Code");
    });

    it("should throw error if authenticated user does not match found user", async () => {
      const fakeUser = {
        id: "differentUserId", // Simulating different user ID
        tempE: "newEmail@example.com",
        email: "msdos@gmail.com",
        code: "00000",
        save: jest.fn(),
      };

      // Mock the response from User.findOne to return a fake user
      (User.findOne as jest.Mock).mockResolvedValueOnce(fakeUser);

      // Mock getAuthenticatedUser to return the mock authenticated user's ID
      (getAuthenticatedUser as jest.Mock).mockReturnValueOnce({
        id: mockUserId, // Mocked authenticated user ID
      });

      // Call the updateEmail function
      await userController.updateEmail(req as Request, res as Response, next);

      // Ensure getAuthenticatedUser and User.findOne were called with the correct arguments
      expect(getAuthenticatedUser).toHaveBeenCalledWith(req);
      expect(User.findOne).toHaveBeenCalledWith({ vCode: "1234" });

      // Expect customErr to be called when user IDs don't match
      expect(customErr).toHaveBeenCalledWith(
        STATUS_CODE_BAD_REQUEST,
        "Wrong Code"
      );

      // Ensure save was not called on the fake user
      expect(fakeUser.save).not.toHaveBeenCalled();
    });

    it("should call next with error if exception is thrown", async () => {
      const mockError = new Error("Database failure");
      (User.findOne as jest.Mock).mockRejectedValueOnce(mockError);

      await userController.updateEmail(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
