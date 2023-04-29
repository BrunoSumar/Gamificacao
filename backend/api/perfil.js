const PerfilDAO = require("../DAO/PerfilDAO");
const { patch: SchemaPerfilPatch } = require("../schemas/perfil");

module.exports = async function routes(fastify) {
  fastify.patch(
    "/",
    { schema: SchemaPerfilPatch },
    async (req, reply) => {
      try {
        const perfilDAO = new PerfilDAO(fastify.pg);
        perfil = await perfilDAO.update(req.body, req.auth.ID_aluno);
        resp = {
            Avatar: perfil.row.TP_avatar,
            Cor_RGB: perfil.row.TXT_cor_rgb
        }
        reply.code(200);
        return resp
      } catch (error) {
        reply.code(500);
        return {
          err: error,
          msg: "Não foi possivel editar o perfil, tente novamente",
        };
      }
    }
  );

  fastify.get(
    "/",
    async (req, reply) => {
      try {
        const perfilDAO = new PerfilDAO(fastify.pg);
        perfil = await  perfilDAO.read(req.auth.ID_aluno);
        resp = {
            Avatar: perfil.row.TP_avatar,
            Cor_RGB: perfil.row.TXT_cor_rgb
        }
        reply.code(200);
        return resp
      } catch (error) {
        reply.code(500);
        return {
          err: error,
          msg: "Não foi possivel encontrar o perfil, tente novamente",
        };
      }
    }
  );

  fastify.addHook("onRequest", (req, res, done) => {
    if (req.auth.type != 1) {
      res.code(401);
      throw new Error("O Usuario precisa ser um aluno");
    }
    done()
  });
};
