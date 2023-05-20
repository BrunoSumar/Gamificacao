const post = {
  body: {
    type: "object",
    properties: {
      accessToken: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["accessToken"],
  },
};

const SchemaLoginAdministrador = {
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
    required: ["user", "password"],
  },
};

module.exports = {
  post,
  SchemaLoginAdministrador,
};
