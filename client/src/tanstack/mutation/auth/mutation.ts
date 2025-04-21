import { useMutation } from "@tanstack/react-query";

import { signIn, signUp, verifySignUp } from "../../api/auth/api";
import {
  CustomErrType,
  NoDataPayloadType,
  SignInPayloadType,
  SigninType,
  SignUpType,
  VerifySignUpType,
} from "../../../types";

export const useSignInMutation = () => {
  return useMutation<SignInPayloadType, CustomErrType, SigninType>({
    mutationFn: (data) => signIn(data),
  });
};

export const useSignUpMutation = () => {
  return useMutation<NoDataPayloadType, CustomErrType, SignUpType>({
    mutationFn: (data) => signUp(data),
  });
};

export const useVerifySignUpMutation = () => {
  return useMutation<NoDataPayloadType, CustomErrType, VerifySignUpType>({
    mutationFn: (data) => verifySignUp(data),
  });
};
