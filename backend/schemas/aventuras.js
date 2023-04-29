const GET = {};

const GET_ID = {
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'string',
                maxLength: 10,
            },
        },
        additionalProperties: false,
        required: [ 'id_aventura' ],
    },
};

const POST = {
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
        required: [ 'TXT_nome', 'TXT_descricao' ],
    },
};

const PATCH = { ...POST, required: [] };

const PATCH_ALUNO = {
    params: {
        type: 'object',
        properties: {
            id_aventura: {
                type: 'string',
                maxLength: 10,
            },
            id_aluno: {
                type: 'string',
                maxLength: 10,
            },
        },
        additionalProperties: false,
        required: [ 'id_aluno', 'id_aventura' ],
    },
};

const DELETE = GET_ID;

const DELETE_ALUNO = PATCH_ALUNO;

module.exports = {
    GET,
    GET_ID,
    POST,
    PATCH,
    PATCH_ALUNO,
    DELETE,
    DELETE_ALUNO,
};
