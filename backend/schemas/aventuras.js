const GET = {};

const GET_ID = {
    params: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 10,
            },
        },
        additionalProperties: false,
        required: [ 'id' ],
    },
};

const POST = {
    body: {
        type: 'object',
        properties: {
            Name: {
                type: 'string',
                maxLength: 50,
            },
            Description: {
                type: 'string',
            },
            isEvent: {
                type: 'boolean',
                default: false,
            },
            ClassNumber: {
                type: 'string',
                maxLength: 10,
            },
            dataInicio: {
                type: 'string',
            },
            dataTermino: {
                type: 'string',
            },
        },
        additionalProperties: false,
        required: [ 'Name', 'Description' ],
    },
};

module.exports = {
    GET,
    GET_ID,
    POST,
};
