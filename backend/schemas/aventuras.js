const POST = {
    body: {
        type: 'object',
        properties: {
            exemplo: {
                type: 'string',
            }
        },
        additionalProperties: false,
        required: [],
    },
};

module.exports = {
    POST,
};
