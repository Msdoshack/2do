import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
}

interface ITodo extends mongoose.Document {
  title: string;
  description: string;
  reminder: boolean;
  reminderInterval:
    | "min"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";
  user: mongoose.Types.ObjectId;
  isDone: boolean;
  // deadline: Date;
  isDeleted: boolean;
}

const todoSchema: mongoose.Schema<ITodo> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide a title for task"],
      unique: [true, "todo with this title already exist"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "write a short description about task"],
      trim: true,
    },

    isDone: {
      type: Boolean,
      default: false,
    },

    reminder: {
      type: Boolean,
      default: true,
    },

    reminderInterval: {
      type: String,
      enum: ["min", "hourly", "daily", "weekly", "monthly", "yearly"],
      default: "daily",
      trim: true,
    },

    // deadline: {
    //   type: Date,
    //   default: () => {
    //     const now = new Date();
    //     return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    //   },
    // },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo: mongoose.Model<ITodo> = mongoose.model("Todo", todoSchema);

export default Todo;
