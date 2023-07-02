const AlunoDAO = require("../DAO/AlunoDAO");
const ProfessorDAO = require("../DAO/ProfessorDAO");
const PerfilDAO = require("../DAO/PerfilDAO");
const AdministradorDAO = require("../DAO/AdministradorDAO");
const {
  post: SchemaLoginPost,
  SchemaLoginAdministrador,
} = require("../schemas/login");
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
      console.log(user)
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
        if (user.user.FL_validado) {
          user.user.id_token = id_token;
          const token = fastify.jwt.sign(user.user);
          return { token };
        } else {
          throw "O usuario precisa ser validado";
        }
      } catch (error) {
        reply.code(401);
        return {
          msg: "Não Foi possivel criar ou logar nesse usuário, tente novamente em alguns segundos",
          err: error,
        };
      }
    }
  );

  fastify.post(
    "/administrador",
    { schema: SchemaLoginAdministrador },
    async (req, reply) => {
      try {
        console.log( req.body )
        const administradorDAO = new AdministradorDAO(fastify.pg);
        const resp = await administradorDAO.readByPassword(req.body);
        const token = fastify.jwt.sign(resp.admin);
        reply.code(200);
        return {
          token,
          message: resp.Message,
        };
      } catch (error) {
        reply.code(401);
        return {
          message: error,
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
      TXT_primeiro_nome: `${googleData.given_name}`,
      TXT_ultimo_nome: `${googleData.family_name}`,
      TXT_email: `${googleData.email}`,
      FL_deletado: false,
      NR_moedas: 0,
    };
  }
  if (userType == "Professor") {
    return {
      ID_google: `${googleData.id}`,
      TXT_primeiro_nome: `${googleData.given_name}`,
      TXT_ultimo_nome: `${googleData.family_name}`,
      TXT_email: `${googleData.email}`,
      FL_deletado: false,
      FL_validado: false,
    };
  }
}
