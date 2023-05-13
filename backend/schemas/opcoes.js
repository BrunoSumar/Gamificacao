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
            id_desafio: {
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
                TXT_descricao: {
                    type: "string",
                },
                FL_opcao_certa: {
                    type: "boolean",
                    default: false,
                },
            },
            additionalProperties: false,
            required: ["TXT_descricao"],
        },
    },
};

const PUT = {
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
    body: {
        type: "array",
        items: {
            type: "object",
            properties: {
                ID_opcao: {
                    type: "integer",
                },
                TXT_descricao: {
                    type: "string",
                },
                FL_opcao_certa: {
                    type: "boolean",
                    default: false,
                },
            },
            additionalProperties: false,
            if: {
                properties: {
                    ID_opcao: { const: null }
                },
            },
            then: {
                required: ["TXT_descricao"],
            },
            else: {
                required: ["ID_opcao"],
            },
        },
    },
};

module.exports = {
    GET,
    POST,
    PUT,
};
