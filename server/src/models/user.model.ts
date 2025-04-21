import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  vCode: string;
  tempE: string;
  role: string;
}

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "provide your username"],
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: [true, "email already in use"],
      trim: true,
      match: [/\S+@\S+\.\S+/, "please fill a valid email address"],
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "User password is required"],
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

    vCode: { type: String, trim: true },
  },
  { timestamps: true }
);

const User: mongoose.Model<IUser> = mongoose.model("User", userSchema);

export default User;
