const schemas = require('../schemas/aventuras');

module.exports = async function privateRoutes(fastify){
    fastify.get('/', { schema: schemas.GET }, async (req, reply) => {
        return null;
    })
}
