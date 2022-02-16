/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function routes(fastify){
    fastify.post('/login', (req, reply) => {
        // TODO: alterar lógica de criação do token
        const token = fastify.jwt.sign({ id: 1, nome: 'abc' })
        reply.send({ token })
    });

    fastify.register(privateRoutes);
}

/** @param {import('fastify').FastifyInstance} fastify */
async function privateRoutes(fastify){
    fastify.verifyJWT(fastify);

    // Exemplo adição de rota aqui
    // fastify.register(require('./nome_rota'), { prefix: 'nome_rota' });
    fastify.register(require('./aventuras'), { prefix: 'aventuras' });

    fastify.get('/ping', async () => ({ status: 200 }));
    fastify.get('/token', async req => req.auth);
}
