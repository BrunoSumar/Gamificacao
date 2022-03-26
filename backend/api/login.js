const AlunoDAO = require("../DAO/AlunoDAO");
const { post: SchemaLoginPost } = require("../schemas/login");
const {
  verify: verifyAccessTokenGoogle,
} = require("../misc/someUsefulFuncsGoogleAuth");

const { tryToRegisterOrGetUser } = require("../misc/someUsefulFuncsAlunos"); 

module.exports = async function routes(fastify) {
  fastify.post("/aluno", { schema: SchemaLoginPost }, async (req, reply) => {
    const alunoDao = new AlunoDAO(fastify.pg);
    try {
      // TODO: colorar tempo de expiração do token
      const { AccessToken } = JSON.parse(req.body);
      let userGoogleData = await verifyAccessTokenGoogle(AccessToken);
      userGoogleData = userGoogleData.dados;
      let user = await tryToRegisterOrGetUser(
        {
          ID_google: `${userGoogleData.sub}`,
          first_name: `${userGoogleData.given_name}`,
          last_name: `${userGoogleData.family_name}`,
          coins: 0,
        },
        alunoDao
      );
      console.log( userGoogleData );
      // user.aluno.row.google_token = userGoogleData;
      user.aluno.row.code = AccessToken;
      const token = fastify.jwt.sign(user.aluno.row);
      return { token };
    } catch (error) {
      reply.code(401)
      return {
        err: error,
        msg: "Não Foi possivel criar ou logar nesse usuario, tente novamente em alguns segundos",
      };
    }
  });
};
