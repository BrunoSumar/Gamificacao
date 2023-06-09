const GET = {};

const GET_ID = {
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'integer',
            },
        },
        additionalProperties: false,
        required: [ 'id_aventura' ],
    },
};

const POST = {
    description: 'Cria um aventura.',
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'integer',
            },
        },
        additionalProperties: false,
        required: [ 'id_aventura' ],
    },
    body: {
        type: 'object',
        properties: {
            TXT_nome: {
                type: 'string',
                maxLength: 50,
            },
            TXT_descricao: {
                type: 'string',
            },
            FL_evento: {
                type: 'boolean',
                default: false,
            },
            TXT_numero_classe: {
                type: 'string',
                maxLength: 10,
            },
            DT_inicio: {
                type: 'string',
            },
            DT_termino: {
                type: 'string',
            },
        },
        additionalProperties: false,
        required: [ 'TXT_nome', 'TXT_descricao', 'DT_inicio', 'DT_termino' ],
    },
};

const PATCH = {
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'integer',
            },
        },
        additionalProperties: false,
        required: [ 'id_aventura' ],
    },
    body: {
        type: 'object',
        properties: {
            TXT_nome: {
                type: 'string',
                maxLength: 50,
            },
            TXT_descricao: {
                type: 'string',
            },
            FL_evento: {
                type: 'boolean',
            },
            TXT_numero_classe: {
                type: 'string',
                maxLength: 10,
            },
            DT_inicio: {
                type: 'string',
            },
            DT_termino: {
                type: 'string',
            },
        },
        additionalProperties: false,
    },
};

const PATCH_ALUNO = {
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'integer',
            },
            id_aluno: {
                type: 'integer',
            },
        },
        additionalProperties: false,
        required: [ 'id_aluno', 'id_aventura' ],
    },
};

const DELETE = GET_ID;

const DELETE_ALUNO = PATCH_ALUNO;

const GET_NOTAS = {
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
  }

module.exports = {
    GET,
    GET_ID,
    POST,
    PATCH,
    PATCH_ALUNO,
    DELETE,
    DELETE_ALUNO,
    GET_NOTAS
};
