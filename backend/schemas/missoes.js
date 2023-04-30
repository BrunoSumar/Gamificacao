const GET = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: ["id_aventura"],
  },
};

const POST = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: ["id_aventura"],
  },
  body: {
    type: "object",
    properties: {
      TXT_titulo: {
        type: "string",
        maxLength: 50,
      },
      TXT_descricao: {
        type: "string",
      },
      FL_grupo: {
        type: "boolean",
        default: false,
      },
      DT_entrega_maxima: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: ["TXT_titulo", "DT_entrega_maxima"],
  },
};

const PATCH = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
        maxLength: 10,
      },
      id_missao: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: ["id_aventura", "id_missao"],
  },
  body: {
    type: "object",
    properties: {
      TXT_titulo: {
        type: "string",
        maxLength: 50,
      },
      TXT_descricao: {
        type: "string",
      },
      FL_grupo: {
        type: "boolean",
        default: false,
      },
      DT_entrega_maxima: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: [""],
  },
};

const DELETE = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "string",
        maxLength: 10,
      },
      id_missao: {
        type: "string",
        maxLength: 10,
      },
    },
    additionalProperties: false,
    required: ["id_aventura", "id_missao"],
  },
};

module.exports = {
  GET,
  POST,
  PATCH,
  DELETE
};
