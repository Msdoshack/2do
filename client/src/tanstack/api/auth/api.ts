import axios from "axios";
import {
  SignInPayloadType,
  SigninType,
  SignUpType,
  VerifySignUpType,
} from "../../../types";

const API_URL = {
  signIn: "/api/v1/auth/sign-in",
  signUp: "/api/v1/auth/sign-up",
  verifySignUp: "/api/v1/auth/verify-sign-up",
};

export const signUp = async (data: SignUpType) => {
  return (await axios.post(`${API_URL.signUp}`, data)).data;
};

export const verifySignUp = async (data: VerifySignUpType) => {
  return (await axios.post(`${API_URL.verifySignUp}`, data)).data;
};

export const signIn = async (data: SigninType) => {
  return (await axios.post<SignInPayloadType>(`${API_URL.signIn}`, data)).data;
};
