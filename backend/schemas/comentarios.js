const get = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id_aventura"],
  },
};
const post = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id_aventura"],
  },
  body: {
    type: "object",
    properties: {
      FK_referencia: {
        type: "number",
      },
      TXT_comentario: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["TXT_comentario"],
  },
};

const deleteComentario = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      id_aventura: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id", "id_aventura"],
  },
};

const patch = {
  params: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
      id_aventura: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["id", "id_aventura"],
  },
  body: {
    type: "object",
    properties: {
      TXT_comentario: {
        type: "string",
      },
    },
    additionalProperties: false,
    required: ["TXT_comentario"],
  },
};

module.exports = {
  get,
  post,
  deleteComentario,
  patch,
};
