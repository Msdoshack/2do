import axios from "axios";
import {
  AddTodoPayloadType,
  AddTodoType,
  TodoType,
  UpdateTodoStatusType,
  UpdateTodoType,
} from "../../../types";

const API_URL = {
  getTodos: "/api/v1/todos",
  getSingleTodo: "/api/v1/todos",
  getUserTodos: "/api/v1/todos/user/todo",
  addTodo: "/api/v1/todos",
  updateTodo: "/api/v1/todos",
  updateTodoStatus: "/api/v1/todos/status",
  deleteTodo: "/api/v1/todos",
  trashTodo: "/api/v1/todos/trash",
  markDone: "/api/v1/todos/mark-done",
  toggleReminder: "/api/v1/todos/toggle-reminder",
  restoreTodo: "/api/v1/todos/restore-todo",
};

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

export const addTodo = async (data: AddTodoType) => {
  return (
    await axios.post<AddTodoPayloadType>(`${API_URL.addTodo}`, data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const updateTodo = async (data: UpdateTodoType) => {
  return (
    await axios.put(`${API_URL.updateTodo}/${data.todoId}`, data.data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const getAllTodo = async () => {
  return (
    await axios.get<TodoType>(`${API_URL.getTodos}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const getAllUserTodos = async (query?: string) => {
  return (
    await axios.get(`${API_URL.getUserTodos}?${query}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const getSingleTodo = async (todoId: string) => {
  return (
    await axios.get(`${API_URL.getSingleTodo}/${todoId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const updateTodoStatus = async (
  data: UpdateTodoStatusType,
  todoId: string
) => {
  return await axios.post(`${API_URL.updateTodoStatus}/${todoId}`, data, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

export const deleteTodo = async (todoId: string) => {
  return (
    await axios.delete(`${API_URL.deleteTodo}/${todoId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const trashTodo = async (todoId: string) => {
  return (
    await axios.delete(`${API_URL.trashTodo}/${todoId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const markTodoAsDone = async (todoId: string) => {
  return (
    await axios.put(
      `${API_URL.markDone}/${todoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
  ).data;
};

export const toggleReminder = async (todoId: string) => {
  return (
    await axios.put(`${API_URL.toggleReminder}/${todoId}`, null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const restoreTodo = async (todoId: string) => {
  return (
    await axios.put(`${API_URL.restoreTodo}/${todoId}`, null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};
