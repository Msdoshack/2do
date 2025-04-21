export interface CustomErrorType extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
}

export enum ReminderEnum {
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
}

export enum RolesEmum {
  "user",
  "admin",
}

export interface AuthUser extends Express.User {
  user: string;
  role: string;
}

export interface UserIdParam extends Request {
  userId: string;
}

export interface TodoIdParam extends Request {
  todoId: string;
}
