import { NextFunction, Request, Response } from "express-serve-static-core";
// import mongoose from "mongoose";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import bcrypt from "bcryptjs";
import CreateUserDto from "../dtos/createUser.dto";
import SignInUserDto from "../dtos/signinUser.dto";
import customErr from "../utils/customErr";
import { matchedData } from "express-validator";
import {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_CONFLICT,
  STATUS_CODE_CREATED,
  STATUS_CODE_OK,
} from "../constants/statusCode";
import { getAuthenticatedUser } from "../utils/getAuthenticatedUser";
import CheckIfPasswordMatch from "../dtos/checkIfPasswordMatch.dto";
import TempUser from "../models/tempUser.model";
import generateRandomNo from "../utils/generateRandomNo";
import sendMail from "../utils/sendEmail";

export const signUp = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction
) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { username, email, password } = req.body;

    const isExisting = await User.findOne({ email });

    if (isExisting) {
      customErr(STATUS_CODE_CONFLICT, "User already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const code = generateRandomNo();

    await sendMail(email, "2DO⏰ - Confirm registration", "signUpEmail", {
      username,
      code,
    });

    await TempUser.create(
      {
        username,
        email,
        password: hashPassword,
        signUpCode: code,
      }
      // { session }
    );

    // await session.commitTransaction();

    // session.endSession();

    res.status(STATUS_CODE_CREATED).json({
      success: true,
      message: "code sent",
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    next(error);
  }
};

export const verifySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;
    if (!code) {
      customErr(
        STATUS_CODE_BAD_REQUEST,
        "please type in the code sent to your email"
      );
      return;
    }

    const findUser = await TempUser.findOne({ signUpCode: code });

    if (!findUser) {
      customErr(STATUS_CODE_BAD_REQUEST, "invalid code");
      return;
    }

    await User.create({
      username: findUser.username,
      email: findUser.email,
      password: findUser.password,
    });

    await findUser.deleteOne();

    res.status(STATUS_CODE_OK).json({
      success: true,
      message: "account created",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request<{}, {}, SignInUserDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = matchedData(req);

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      customErr(STATUS_CODE_BAD_REQUEST, "Wrong email or password");
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password!
    );

    if (!isPasswordCorrect) {
      customErr(STATUS_CODE_BAD_REQUEST, "Wrong email or password");
      return;
    }

    const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET!, {
      expiresIn: "1d",
    });

    const { password: userPassword, ...userWithoutPassword } =
      foundUser.toObject();

    res.status(STATUS_CODE_OK).json({
      success: true,
      message: "user signed in successfully",
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    next(error);
  }
};

export const passwordCheck = async (
  req: Request<{}, {}, CheckIfPasswordMatch>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = getAuthenticatedUser(req);
    const foundUser = await User.findById(user);
    const { password } = req.body;

    if (!foundUser) {
      customErr(404, "user not found");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordMatch) {
      customErr(400, "incorrect password");
    }

    res.status(200).json({ success: true, message: "Ok" });
  } catch (error) {
    next(error);
  }
};
