export const changePasswordValidation = {
  password: {
    isString: {
      errorMessage: "password must be a string",
    },

    notEmpty: {
      errorMessage: "password field is required",
    },
  },

  newPassword: {
    isString: {
      errorMessage: "new password must be a string",
    },
    notEmpty: {
      errorMessage: "new password field is required",
    },
  },
};
