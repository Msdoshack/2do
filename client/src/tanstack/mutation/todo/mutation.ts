import { useMutation } from "@tanstack/react-query";
import {
  addTodo,
  deleteTodo,
  markTodoAsDone,
  restoreTodo,
  toggleReminder,
  trashTodo,
  updateTodo,
} from "../../api/todo/api";
import {
  AddTodoPayloadType,
  AddTodoType,
  CustomErrType,
  NoDataPayloadType,
  UpdateTodoType,
} from "../../../types";

export const useAddTodo = () => {
  return useMutation<AddTodoPayloadType, CustomErrType, AddTodoType>({
    mutationFn: (data) => addTodo(data),
  });
};

export const useUpdateTodo = () => {
  return useMutation<NoDataPayloadType, CustomErrType, UpdateTodoType>({
    mutationFn: (data) => updateTodo(data),
  });
};

export const useDeleteTodo = () => {
  return useMutation<
    NoDataPayloadType,
    CustomErrType,
    { todoId: string; token: string }
  >({
    mutationFn: ({ todoId, token }) => deleteTodo({ todoId, token }),
  });
};

export const useTrashTodo = () => {
  return useMutation<
    NoDataPayloadType,
    CustomErrType,
    { todoId: string; token: string }
  >({
    mutationFn: ({ todoId, token }) => trashTodo({ todoId, token }),
  });
};

export const useMarkTodoAsDone = () => {
  return useMutation<
    NoDataPayloadType,
    CustomErrType,
    { todoId: string; token: string }
  >({
    mutationFn: ({ todoId, token }) => markTodoAsDone({ todoId, token }),
  });
};

export const useToggleReminder = () => {
  return useMutation<
    NoDataPayloadType,
    CustomErrType,
    { todoId: string; token: string }
  >({
    mutationFn: ({ todoId, token }) => toggleReminder({ todoId, token }),
  });
};

export const useRestoreTodo = () => {
  return useMutation<
    NoDataPayloadType,
    CustomErrType,
    { todoId: string; token: string }
  >({
    mutationFn: ({ todoId, token }) => restoreTodo({ todoId, token }),
  });
};
