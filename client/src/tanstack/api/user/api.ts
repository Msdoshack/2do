import axios from "axios";
import {
  ChangePasswordType,
  UpdateEmailType,
  UserPayloadType,
  UserType,
  VerifyEmailType,
} from "../../../types";

const API_URL = {
  getAllUsers: "/api/v1/users",
  getSingleUser: "/api/v1/users/single-user",
  updateUserEmail: "/api/v1/users/update-email",
  verifyEmail: "/api/v1/users/verify-email",
  deleteUser: "/api/v1/users/delete-user",
  changePassword: "/api/v1/users/change-password",
};

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

export const getAllUser = async () => {
  return (await axios.get<UserType>(`${API_URL.getAllUsers}`)).data;
};

export const getSingleUser = async () => {
  return (
    await axios.get<UserPayloadType>(`${API_URL.getSingleUser}/`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
  ).data;
};

export const verifyEmail = async (data: VerifyEmailType) => {
  return (
    await axios.post(API_URL.verifyEmail, data, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
  ).data;
};

export const updateUserEmail = async (data: UpdateEmailType) => {
  return (
    await axios.patch(`${API_URL.updateUserEmail}`, data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const changePassword = async (data: ChangePasswordType) => {
  return (
    await axios.patch(`${API_URL.changePassword}`, data, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  ).data;
};

export const deleteUser = async (userId: string) => {
  return (await axios.delete(`${API_URL.deleteUser}/${userId}`)).data;
};
