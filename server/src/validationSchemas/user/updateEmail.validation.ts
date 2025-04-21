export const updateEmailValidation = {
  code: {
    notEmpty: {
      errorMessage: "email field is required",
    },
    isString: {
      errorMessage: "email must be of string type",
    },
  },
};
