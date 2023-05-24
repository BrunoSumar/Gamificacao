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
            conteudo: {},
            id_grupo: {
                type: "object",
                properties: {
                    value: {
                        type: "string",
                        pattern: "^\\d+$",
                    },
                },
            },
        },
        additionalProperties: false,
        required: ["conteudo"],
    },
};

const PATCH_NOTA = {
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
            id_resposta: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["id_aventura", "id_missao", "id_desafio", "id_resposta"],
    },
    body: {
        type: "object",
        properties: {
            NR_nota_grande_desafio: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["NR_nota_grande_desafio"],
    },
};

module.exports = {
    GET,
    POST,
    PATCH,
    PATCH_NOTA,
    DELETE,
    PUT,
};
