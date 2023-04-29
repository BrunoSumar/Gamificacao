const post = {
  body: {
    type: "object",
    properties: {
      TXT_titulo: {
        type: "string",
      },
      NR_minimo: {
        type: "number",
      },
    },
    additionalProperties: false,
    required: ['TXT_titulo', 'NR_minimo'],
  },
};

const deleteMedal = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id"],
  },
};

const patch = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      TXT_titulo: {
        type: "string",
      },
      NR_minimo: {
        type: "number",
      },
    },
    additionalProperties: false,
    required: ["TXT_titulo","NR_minimo"],
  },
};

module.exports = {
  post,
  deleteMedal,
  patch
};
