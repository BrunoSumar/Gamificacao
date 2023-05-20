const AdministradorDAO = require("../DAO/AdministradorDAO");
const ProfessorDAO = require("../DAO/ProfessorDAO");
const { PATCH, POST, POST_VALIDA } = require("../schemas/adminstrador");
const { onRequest } = require("../misc/someUsefulFuncsHooks");
module.exports = async function routes(fastify) {
  fastify.post("/", { schema: POST }, async (req, res) => {
    try {
      const administradorDAO = new AdministradorDAO(fastify.pg);
      const resp = await administradorDAO.create(req.body);
      const token = fastify.jwt.sign(resp.admin);
      res.code(200);
      return {
        token,
        message: resp.message,
      };
    } catch (error) {
      res.code(400);
      return {
        message: error,
      };
    }
  });

  fastify.patch("/", { schema: PATCH }, async (req, res) => {
    try {
      const administradorDAO = new AdministradorDAO(fastify.pg);
      const resp = await administradorDAO.patch({
        ID_Administrador: req.auth.ID_Administrador,
        ...req.body,
      });
      res.code(200);
      return {
        message: resp,
      };
    } catch (error) {
      res.code(400);
      return {
        message: error,
      };
    }
  });

  fastify.post(
    "/valida_professor/:id",
    { schema: POST_VALIDA },
    async (req, res) => {
      try {
        const professorDAO = new ProfessorDAO(fastify.pg);
        const resp = await professorDAO.update(
          { FL_validado: true },
          req.params.id
        );
        res.code(200);
        return {
          message: resp.msg,
          row: resp.rows
        };
      } catch (error) {
        res.code(400);
        return {
          message: error,
        };
      }
    }
  );
  fastify.addHook("onRequest", onRequest.somente_administrador);
};
