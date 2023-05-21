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

const POST_VALIDA = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "integer",
      },
    },
    additionalProperties: false,
    required: ["id"],
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
  POST_VALIDA,
};
