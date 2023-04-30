const GET = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
      },
      id_missao: {
        type: "integer",
      },
      id_grupo: {
        type: "integer",
      },
    },
    additionalProperties: false,
      required: ["id_aventura", "id_missao"],
  },
};

const POST = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
      },
      id_missao: {
        type: "integer",
      },
    },
    additionalProperties: false,
    required: ["id_aventura", "id_missao"],
  },
};

const POST_PARTICIPAR = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
      },
      id_missao: {
        type: "integer",
      },
      id_grupo: {
        type: "integer",
      },
    },
    additionalProperties: false,
      required: ["id_aventura", "id_missao", "id_grupo"],
  },
};

const DELETE = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
      },
      id_missao: {
        type: "integer",
      },
      id_grupo: {
        type: "integer",
      },
    },
    additionalProperties: false,
      required: ["id_aventura", "id_missao", "id_grupo"],
  },
};

module.exports = {
  GET,
  POST,
  POST_PARTICIPAR,
  DELETE,
};
