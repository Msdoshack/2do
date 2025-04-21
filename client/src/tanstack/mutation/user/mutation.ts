import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePassword,
  getSingleUser,
  updateUserEmail,
  verifyEmail,
} from "../../api/user/api";
import {
  ChangePasswordType,
  CustomErrType,
  NoDataPayloadType,
  UpdateEmailType,
  UserPayloadType,
  VerifyEmailPayloadType,
  VerifyEmailType,
} from "../../../types";

export const useGetUserQuery = ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  return useQuery<UserPayloadType, CustomErrType>({
    queryKey: ["user", { userId }],
    queryFn: () => getSingleUser(token),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation<VerifyEmailPayloadType, CustomErrType, VerifyEmailType>({
    mutationFn: (data) => verifyEmail(data),
  });
};

export const useUpdateEmailMutation = () => {
  return useMutation<NoDataPayloadType, CustomErrType, UpdateEmailType>({
    mutationFn: (data) => updateUserEmail(data),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<NoDataPayloadType, CustomErrType, ChangePasswordType>({
    mutationFn: (data) => changePassword(data),
  });
};
