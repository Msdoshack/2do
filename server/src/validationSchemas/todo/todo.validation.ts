export const addTodoValidation = {
  title: {
    notEmpty: {
      errorMessage: "title field is required",
    },
    isString: {
      errorMessage: "title must be a string",
    },
  },

  description: {
    notEmpty: {
      errorMessage: "description field is required",
    },

    isString: {
      errorMessage: "description must be a string",
    },
  },

  deadline: {
    optional: true,
    isISO8601: {
      errorMessage: "Deadline must be a valid ISO date",
    },
  },

  reminderInterval: {
    isString: {
      errorMessage: "reminder interval must be a string",
    },
  },
};

export const updateTodoValidation = {
  title: {
    optional: true,
    isString: {
      errorMessage: "Title must be a string",
    },
  },

  description: {
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  deadline: {
    optional: true,
    isISO8601: {
      errorMessage: "Deadline must be a valid ISO date",
    },
  },

  reminderInterval: {
    optional: true,
    isString: {
      errorMessage: "Reminder interval must be a string",
    },
  },

  isDone: {
    optional: true,
    isBoolean: {
      errorMessage: "Status must be a boolean",
    },
  },
};
