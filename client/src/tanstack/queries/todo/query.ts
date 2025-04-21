import { useQuery } from "@tanstack/react-query";
import { getAllUserTodos, getSingleTodo } from "../../api/todo/api";
import {
  CustomErrType,
  SingleTodoPayloadType,
  TodosPayloadType,
} from "../../../types";

export const useGetUserTodos = (query?: string, offset?: number) => {
  return useQuery<TodosPayloadType, CustomErrType>({
    queryKey: ["todos", { offset }],
    queryFn: () => getAllUserTodos(query),
  });
};

export const useGetSingleTodo = (todoId: string) => {
  return useQuery<SingleTodoPayloadType>({
    queryKey: ["todo", { todoId }],
    queryFn: () => getSingleTodo(todoId),
  });
};
