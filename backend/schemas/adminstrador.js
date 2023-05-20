const POST = {
  body: {
    type: "object",
    properties: {
      user: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["password", "user"],
  },
};

const PATCH = {
  body: {
    type: "object",
    properties: {
      password: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["password"],
  },
};

module.exports = {
  POST,
  PATCH,
};
