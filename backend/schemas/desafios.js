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
        },
        additionalProperties: false,
        required: ["id_aventura", "id_missao"],
    },
};

const GET_ID = {
    params: {
        type: "object",
        properties: {
            id_aventura: {
                type: "integer",
            },
            id_missao: {
                type: "integer",
            },
            id_desafio: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["id_aventura", "id_missao", "id_desafio"],
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
    body: {
        type: "array",
        items: {
            type: "object",
            properties: {
                NR_indice: {
                    type: "integer",
                },
                TXT_titulo: {
                    type: "string",
                    maxLength: 50,
                },
                TXT_descricao: {
                    type: "string",
                },
                FL_grande_desafio: {
                    type: "boolean",
                    default: false,
                },
            },
            additionalProperties: false,
            required: ["NR_indice","TXT_titulo", "TXT_descricao"],
        },
    },
};

const UPDATE = {
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
        type: "array",
        items: {
            type: "object",
            properties: {
                ID_desafio: {
                    type: "integer",
                },
                NR_indice: {
                    type: "integer",
                },
                TXT_titulo: {
                    type: "string",
                    maxLength: 50,
                },
                TXT_descricao: {
                    type: "string",
                },
                FL_grande_desafio: {
                    type: "boolean",
                    default: false,
                },
            },
            additionalProperties: false,
            required: ["ID_desafio"],
        },
    },
};

module.exports = {
    GET,
    GET_ID,
    POST,
    UPDATE,
};
