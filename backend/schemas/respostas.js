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

module.exports = {
    GET,
    POST,
    PATCH,
    DELETE,
};
