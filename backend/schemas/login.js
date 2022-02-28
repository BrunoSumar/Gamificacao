const post = {
  body: {
    type: "string",
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
