const GET = {};
const DELETE = {};

const GET_ID = {
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
      TXT_num_matricula: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["TXT_num_matricula"],
  },
};

module.exports = {
  GET,
  GET_ID,
  PATCH,
  DELETE,
};
