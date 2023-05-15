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
        required: ["id_aventura", "id_missao", "id_desafio"],
    },
    body: {
        type: "object",
        properties: {
            FK_opcao: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["FK_opcao"],
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
            id_desafio: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["id_aventura", "id_missao", "id_desafio"],
    },
    body: {
        type: "object",
        properties: {
            FK_opcao: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["FK_opcao"],
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
            id_desafio: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["id_aventura", "id_missao", "id_desafio"],
    },
};

const PUT = {
    consumes: ['multipart/form-data'],
    body: {
        type: "object",
        properties: {
            id_grupo: {
                type: "object",
                properties: {
                    value: {
                        type: "string",
                        pattern: "^\\d+$",
                    },
                },
            },
            conteudo: {},
        },
        additionalProperties: false,
        required: ["conteudo"],
    },
};

module.exports = {
    GET,
    POST,
    PATCH,
    DELETE,
    PUT,
};
