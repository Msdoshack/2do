import { CustomErrorType } from "../types/index.type";

const customErr = (statusCode: number, errMessage: string) => {
  const error: CustomErrorType = new Error(errMessage);
  error.statusCode = statusCode;
  throw error;
};
export default customErr;
