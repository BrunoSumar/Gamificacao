const GET = {
    querystring: {
        type: 'object',
        properties: {
            exemplo: {
                type: 'string',
            }
        },
        additionalProperties: false,
    },
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'integer'
            },
            size: {
                type: 'integer'
            }
        },
        additionalProperties: false,
        required: [],
    }
};

module.exports = {
    GET,
};
