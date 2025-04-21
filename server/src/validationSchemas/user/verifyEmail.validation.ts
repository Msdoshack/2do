export const verifyEmailValidation = {
  email: {
    isString: {
      errorMessage: "email must be of string type",
    },
    notEmpty: {
      errorMessage: "email field is required",
    },
    isEmail: {
      errorMessage: "invalid email format",
    },
  },

  password: {
    isString: {
      errorMessage: "password must be a string",
    },
    notEmpty: {
      errorMessage: "password field is required",
    },
  },
};
