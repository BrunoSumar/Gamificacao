const GET = {
    params: {
        type: "object",
        properties: {
            id_conteudo: {
                type: "integer",
            },
        },
        additionalProperties: false,
        required: ["id_conteudo"],
    },
};

module.exports = {
    GET,
};
