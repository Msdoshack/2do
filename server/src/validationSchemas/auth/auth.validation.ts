import { Location } from "express-validator";

export const signInValidation = {
  email: {
    in: ["body"] as Location[],
    notEmpty: {
      errorMessage: "Email field is required",
    },

    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
  password: {
    in: ["body"] as Location[],
    notEmpty: {
      errorMessage: "Password field is required",
    },
  },
};

export const signUpValidation = {
  username: {
    notEmpty: {
      errorMessage: "Username field is required",
    },

    isLength: {
      options: {
        min: 3,
        max: 12,
      },
      errorMessage:
        "Username must be at least 3 characters with max of 12 characters",
    },

    isString: {
      errorMessage: "Username must be a string",
    },
  },

  password: {
    notEmpty: {
      errorMessage: "Password field is required",
    },

    isString: {
      errorMessage: "Password must be a string",
    },
  },

  email: {
    notEmpty: {
      errorMessage: "Email field is required",
    },

    isEmail: {
      errorMessage: "Invalid email format",
    },
  },
};

export const verifySignUpValidation = {
  code: {
    isString: {
      errorMessage: "Code must be of string type",
    },

    notEmpty: {
      errorMessage: "Code must not be empty",
    },
  },
};

export const passwordCheckValidation = {
  password: {
    notEmpty: {
      errorMessage: "Password field is required",
    },
    isString: {
      errorMessage: "Password must be of string type",
    },
  },
};
