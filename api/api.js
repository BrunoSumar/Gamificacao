/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function routes(fastify){
    fastify.register(privateRoutes);
}

/** @param {import('fastify').FastifyInstance} fastify */
async function privateRoutes(fastify){
    fastify.verifyJWT(fastify);

    // Exemplo adição de rota aqui
    // fastify.register(require('./nome_rota'), { prefix: 'nome_rota' });

    fastify.get('/ping', async () => ({ status: 200 }));
}
