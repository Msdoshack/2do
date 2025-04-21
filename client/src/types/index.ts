export type UserType = {
  _id: string;
  username: string;
  email: string;
};

export type UserPayloadType = {
  success: true;
  data: UserType;
};

export type SignUpType = {
  username: string;
  email: string;
  password: string;
};

export type VerifySignUpType = {
  code: string;
};

export type SigninType = {
  email: string;
  password: string;
};

export type ChangePasswordType = {
  data: { password: string; newPassword: string };
  token: string;
};

export type UpdateEmailType = {
  data: { code: string };
  token: string;
};

export type VerifyEmailType = {
  data: { email: string; password: string };
  token: string;
};

export type TodoType = {
  _id: string;
  title: string;
  description: string;
  isDone: boolean;
  user: string | UserType;
  reminderInterval: string;
  deadline: Date;
  isDeleted: boolean;
  createdAt: string;
  reminder: boolean;
};

export type TodosPayloadType = {
  success: boolean;
  data: TodoType[];
};

export type VerifyEmailPayloadType = {
  success: boolean;
  message: string;
  data: { email: string };
};

export type SingleTodoPayloadType = {
  success: boolean;
  data: TodoType;
};

export type AddTodoType = {
  title: string;
  description: string;
  reminderInterval: string;
  deadline?: Date | undefined;
  token: string;
};

export type AddTodoPayloadType = {
  success: boolean;
  message: string;
  data: TodoType;
};

export type UpdateTodoType = {
  todoId: string;
  token: string;
  data: {
    title: string;
    description: string;
    isDone: boolean;
    reminderInterval: string;
    deadline?: Date;
  };
};

export type UpdateTodoStatusType = {
  status: string;
  todoId: string;
  token: string;
};

export type DeleteTodoPayloadType = {
  success: boolean;
  message: string;
};

export type NoDataPayloadType = {
  success: boolean;
  message: string;
};

export type SignInPayloadType = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      _id: string;
      username: string;
      email: string;
    };
  };
};

export type CustomErrType = {
  response: {
    data: {
      success: boolean;
      error: string;
    };
  };
  status: number;
  code: string;
};
