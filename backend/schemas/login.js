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

module.exports = {
  post,
};
