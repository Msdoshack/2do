import mongoose from "mongoose";

interface ITempUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  signUpCode: string;
  tempE: string;
  role: string;
}

const tempUserSchema: mongoose.Schema<ITempUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "provide your username"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "provide your email"],
      trim: true,
      match: [/\S+@\S+\.\S+/, "please fill a valid email address"],
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "provide your password"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    tempE: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "please fill a valid email address"],
    },

    signUpCode: { type: String, trim: true },
  },
  { timestamps: true }
);

const TempUser: mongoose.Model<ITempUser> = mongoose.model(
  "TempUser",
  tempUserSchema
);

export default TempUser;
