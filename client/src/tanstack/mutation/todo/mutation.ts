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
  return useMutation<NoDataPayloadType, CustomErrType, string>({
    mutationFn: (todoId) => deleteTodo(todoId),
  });
};

export const useTrashTodo = () => {
  return useMutation<NoDataPayloadType, CustomErrType, string>({
    mutationFn: (todoId) => trashTodo(todoId),
  });
};

export const useMarkTodoAsDone = () => {
  return useMutation<NoDataPayloadType, CustomErrType, string>({
    mutationFn: (todoId) => markTodoAsDone(todoId),
  });
};

export const useToggleReminder = () => {
  return useMutation<NoDataPayloadType, CustomErrType, string>({
    mutationFn: (todoId) => toggleReminder(todoId),
  });
};

export const useRestoreTodo = () => {
  return useMutation<NoDataPayloadType, CustomErrType, string>({
    mutationFn: (todoId) => restoreTodo(todoId),
  });
};
