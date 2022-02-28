const AlunoDAO = require("../DAO/AlunoDAO");
const { post: SchemaLoginPost } = require("../schemas/login");
const {
  verify: verifyAccessTokenGoogle,
} = require("../misc/someUsefulFuncsGoogleAuth");

module.exports = async function routes(fastify) {

  fastify.post("/aluno", { schema: SchemaLoginPost }, (req, reply) => {
    const alunoDao = new AlunoDAO(fastify.pg);
    try {
      // TODO: alterar lógica de criação do token
      // TODO: colorar tempo de expiração do token
      // Coloquei o tipo (aluno ou professor) assim temporariamente
      const { accessToken } = req.body;
      let userGoogleData = verifyAccessTokenGoogle(accessToken);
      let user = tryToRegisterOrGetUser(userGoogleData, alunoDao);
      const token = fastify.jwt.sign(user);

      //TODO Registrar login do usuario
      reply.send({ token });
    } catch (error) {
      reply.code(401).send({
        err: error,
        msg: "Não Foi possivel Criar ou logar nesse usuario, tente novamente em alguns segundos",
      });
    }
  });

};
