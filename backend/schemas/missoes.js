const regex_data = '^\\d{4}-\\d{2}-\\d{2}T([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$';

const GET = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
      },
    },
    additionalProperties: false,
    required: ["id_aventura"],
  },
};

const GET_NOTAS = {
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
    required: ["id_aventura",'id_missao'],
  },
  query:{
    type: 'object',
    properties:{
      desafios: {
        type: ['array','null'],
        items: {
          type: 'integer',
        }
      }
    },
    additionalProperties: false,
    required: [],
  }
}

const POST = {
  params: {
    type: "object",
    properties: {
      id_aventura: {
        type: "integer",
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
        maxLength: 50,
        pattern: regex_data,
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
        type: "integer",
      },
      id_missao: {
        type: "integer",
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
        maxLength: 50,
        // pattern: regex_data,
      },
    },
    additionalProperties: false,
    required: [],
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
    },
    additionalProperties: false,
    required: ["id_aventura", "id_missao"],
  },
};

module.exports = {
  GET,
  POST,
  PATCH,
  DELETE,
  GET_NOTAS,
};
