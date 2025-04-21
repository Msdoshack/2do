import { useQuery } from "@tanstack/react-query";
import { getAllUserTodos, getSingleTodo } from "../../api/todo/api";
import {
  CustomErrType,
  SingleTodoPayloadType,
  TodosPayloadType,
} from "../../../types";

export const useGetUserTodos = ({
  query,
  offset,
  token,
}: {
  query?: string;
  offset?: number;
  token?: string;
}) => {
  return useQuery<TodosPayloadType, CustomErrType>({
    queryKey: ["todos", { offset }],
    queryFn: () => getAllUserTodos(query, token),
  });
};

export const useGetSingleTodo = ({
  todoId,
  token,
}: {
  todoId: string;
  token: string;
}) => {
  return useQuery<SingleTodoPayloadType>({
    queryKey: ["todo", { todoId }],
    queryFn: () => getSingleTodo({ todoId, token }),
  });
};
