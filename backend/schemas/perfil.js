const patch = {
  body: {
    type: "object",
    properties: {
      TXT_cor_rgb: {
        type: "string",
        pattern:
          "^((?:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),){2})(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$",
      },
      TP_avatar: {
        type: "integer",
      },
    },
    additionalProperties: false,
  },
};

module.exports = {
  patch,
};
