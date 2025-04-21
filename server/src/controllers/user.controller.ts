import { NextFunction, Request, Response } from "express-serve-static-core";
import User from "../models/user.model";
import customErr from "../utils/customErr";
import ValidateMongoId from "../utils/isValidId";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import { updateUserDto } from "../dtos/updateUser.dto";
import { UserIdParam } from "../types/index.type";

import sendMail from "../utils/sendEmail";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_NOT_FOUND,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from "../constants/statusCode";
import generateRandomNo from "../utils/generateRandomNo";
import UpdateEmailDto from "../dtos/updateEmail.dto";
import verifyEmailDto from "../dtos/verifyEmail.dto";
import bcrypt from "bcryptjs";
import ChangePasswordDto from "../dtos/changePassword.dto";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);

    ValidateMongoId(user);

    const singleUser = await User.findById(user).select("-password");

    if (!singleUser) {
      return customErr(404, "User Not Found");
    }

    res.status(STATUS_CODE_OK).json({
      success: true,
      data: singleUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request<{}, {}, updateUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    ValidateMongoId(user);
    const { userId } = req.params as UserIdParam;
    const { username } = req.body;

    if (!userId) {
      customErr(400, "userId is missing from params");
      return;
    }

    if (userId !== user) {
      customErr(404, "Unauthorized");
      return;
    }

    await User.findByIdAndUpdate(
      user,
      {
        $set: {
          username,
        },
      },
      { new: true }
    );

    res.status(STATUS_CODE_OK).json({ success: true, message: "info updated" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request<{}, {}, verifyEmailDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { email, password } = req.body;

    const code = generateRandomNo();

    const findUser = await User.findById(user);

    if (!findUser) {
      customErr(STATUS_CODE_UNAUTHORIZED, "Unauthorized");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (!isPasswordMatch) {
      customErr(STATUS_CODE_BAD_REQUEST, "Wrong password");
      return;
    }

    await sendMail(email, "Confirmation Code", "verifyEmail", {
      username: findUser.username!,
      code,
    });

    findUser.vCode = code;
    findUser.tempE = email;
    await findUser.save();

    res
      .status(STATUS_CODE_OK)
      .json({ success: true, message: "ok", data: { email: findUser.email } });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (
  req: Request<{}, {}, UpdateEmailDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const { code } = req.body;

    const findUser = await User.findOne({ vCode: code });

    if (!findUser) {
      customErr(STATUS_CODE_BAD_REQUEST, "Wrong Code");
      return;
    }
    if (user != findUser.id) {
      customErr(STATUS_CODE_BAD_REQUEST, "Wrong Code");
      return;
    }

    const newEmail = findUser.tempE;
    findUser.email = newEmail;
    findUser.tempE = "";

    await findUser.save();

    res
      .status(STATUS_CODE_OK)
      .json({ success: true, message: "email changed" });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, newPassword } = req.body;
    const user = getAuthenticatedUser(req);
    const findUser = await User.findById(user);

    if (!findUser) {
      customErr(STATUS_CODE_NOT_FOUND, "user not found");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (!isPasswordMatch) {
      customErr(STATUS_CODE_FORBIDDEN, "wrong password");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    findUser.password = hashedPassword;

    await findUser.save();

    res
      .status(STATUS_CODE_OK)
      .json({ success: true, message: "password changed" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = (req: Request, res: Response) => {
  res.send("this is the delete user route");
};
