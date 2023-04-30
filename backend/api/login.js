const AlunoDAO = require("../DAO/AlunoDAO");
const ProfessorDAO = require("../DAO/ProfessorDAO");
const PerfilDAO = require("../DAO/PerfilDAO");
const { post: SchemaLoginPost } = require("../schemas/login");
const {
  verify: verifyAccessTokenGoogle,
} = require("../misc/someUsefulFuncsGoogleAuth");

const { tryToRegisterOrGetUser } = require("../misc/someUsefulFuncsUsers");
const { onSend } = require("../misc/someUsefulFuncsHooks");

module.exports = async function routes(fastify) {
  fastify.post("/aluno", { schema: SchemaLoginPost }, async (req, reply) => {
    try {
      const alunoDao = new AlunoDAO(fastify.pg);
      const perfilDao = new PerfilDAO(fastify.pg);
      const { access_token: id_token } = JSON.parse(req.body);

      let userGoogleData = await verifyAccessTokenGoogle(id_token);

      let user = await tryToRegisterOrGetUser(
        "Aluno",
        buildUserPayload("Aluno", userGoogleData.dados),
        alunoDao
      );
      user.user.id_token = id_token;
      await perfilDao.create({
        FK_aluno: user.user.ID_aluno,
        TXT_cor_rgb: "0, 0, 255",
        TP_avatar: 1,
      });
      perfil = await perfilDao.read(user.user.ID_aluno);
      resp = {
        Avatar: perfil.row.TP_avatar,
        Cor_RGB: perfil.row.TXT_cor_rgb,
      };
      const token = fastify.jwt.sign(user.user);
      return { token, Perfil: resp };
    } catch (error) {
      reply.code(401);
      return {
        err: error,
        msg: "Não Foi possivel criar ou logar nesse usuario, tente novamente em alguns segundos",
      };
    }
  });

  fastify.post(
    "/professor",
    { schema: SchemaLoginPost },
    async (req, reply) => {
      try {
        const professorDAO = new ProfessorDAO(fastify.pg);
        const { access_token: id_token } = JSON.parse(req.body);
        let userGoogleData = await verifyAccessTokenGoogle(id_token);
        let user = await tryToRegisterOrGetUser(
          "Professor",
          buildUserPayload("Professor", userGoogleData.dados),
          professorDAO
        );
        user.user.id_token = id_token;
        const token = fastify.jwt.sign(user.user);
        return { token };
      } catch (error) {
        reply.code(401);
        return {
          err: error,
          msg: "Não Foi possivel criar ou logar nesse usuario, tente novamente em alguns segundos",
        };
      }
    }
  );

  fastify.addHook("onSend", onSend.registra_login(fastify.pg));
};

function buildUserPayload(userType, googleData) {
  if (userType == "Aluno") {
    return {
      ID_google: `${googleData.id}`,
      first_name: `${googleData.given_name}`,
      last_name: `${googleData.family_name}`,
      coins: 0,
    };
  }
  if (userType == "Professor") {
    return {
      ID_google: `${googleData.id}`,
      TXT_primeiro_nome: `${googleData.given_name}`,
      TXT_ultimo_nome: `${googleData.family_name}`,
      FL_validado: false,
    };
  }
}
