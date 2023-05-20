const AlunoDAO = require("../DAO/AlunoDAO");
const { DELETE, GET, GET_ID, PATCH } = require("../schemas/alunos");
async function routes(fastify) {
  fastify.get("/", { schema: GET }, async (req, reply) => {
    try {
      const alunoDAO = new AlunoDAO(fastify.pg);
      resp = await alunoDAO.read();
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
    }
  });

  fastify.get("/:id", { schema: GET_ID }, async (req, reply) => {
    try {
      const alunoDAO = new AlunoDAO(fastify.pg);
      resp = await alunoDAO.readByID(req.params.id);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
    }
  });

  fastify.patch("/", { schema: PATCH }, async (req, reply) => {
    try {
      const alunoDAO = new AlunoDAO(fastify.pg);
      resp = await alunoDAO.update(req.body, req.auth.ID_aluno);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.delete("/", { schema: DELETE }, async (req, reply) => {
    try {
      const alunoDAO = new AlunoDAO(fastify.pg);
      resp = await alunoDAO.delete(req.auth.ID_aluno);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });
}

module.exports = routes;
