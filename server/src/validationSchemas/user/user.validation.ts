export const updateUserValidation = {
  username: {
    isString: {
      errorMessage: "username must be a string",
    },

    isLength: {
      options: {
        min: 3,
        max: 12,
      },
      errorMessage:
        "Username must be at least 3 characters with max of 12 characters",
    },
  },
};
