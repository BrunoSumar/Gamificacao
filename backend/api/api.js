const { AlunoDAO } = require("../DAO/AlunoDAO");
/** @param {import('fastify').FastifyInstance} fastify */
module.exports = async function routes(fastify) {
  const { post: SchemaLoginPost } = require("../schemas/login");
  fastify.post("/login/aluno", { schema: SchemaLoginPost }, (req, reply) => {
    const alunoDao = new AlunoDAO(fastify.pg);
    try {
      // TODO: alterar lógica de criação do token
      // TODO: colorar tempo de expiração do token
      // Coloquei o tipo (aluno ou professor) assim temporariamente
      const { accessToken } = req.body;
      let userGoogleData = verifyAccessTokenGoogle(accessToken);
      let user = tryToRegisterOrGetUser(userGoogleData, alunoDao);
      const token = fastify.jwt.sign(user);
      reply.send({ token });
    } catch (error) {
      reply.statusCode(401).send({
        err: error,
        msg: "Não Foi possivel Criar ou logar nesse usuario, tente novamente em alguns segundos",
      });
    }
  });
  fastify.register(privateRoutes);
};

/** @param {import('fastify').FastifyInstance} fastify */
async function privateRoutes(fastify) {
  fastify.verifyJWT(fastify);

  // Exemplo adição de rota aqui
  // fastify.register(require('./nome_rota'), { prefix: 'nome_rota' });
  fastify.register(require("./aventuras"), { prefix: "aventuras" });

  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
}
