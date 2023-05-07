const AlunoDAO = require("../DAO/AlunoDAO");
async function routes(fastify) {
  fastify.get("/", async (req, reply) => {
    try {
      const medalhasDAO = new MedalhasDAO(fastify.pg);
      resp = await medalhasDAO.read();
      reply.code(200);
      return { rows: resp.row, msg: resp.msg };
    } catch (error) {
      reply.code(500);
    }
  });

  fastify.patch("/", { schema: patch }, async (req, reply) => {
    try {
      const alunoDAO = new AlunoDAO(fastify.pg);
      resp = await alunoDAO.update(req.body, req.auth.ID_aluno);
      reply.code(200);
      return resp;
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });
}

module.exports = {
  routesADMIN,
  routes,
};
