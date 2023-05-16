const ProfessorDAO = require("../DAO/ProfessorDAO");
const { DELETE, GET, GET_ID, PATCH } = require("../schemas/professores");
async function routes(fastify) {
  fastify.get("/", { schema: GET }, async (req, reply) => {
    try {
      const professorDAO = new ProfessorDAO(fastify.pg);
      resp = await professorDAO.read();
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return error;
    }
  });

  fastify.get("/:id", { schema: GET_ID }, async (req, reply) => {
    try {
      const professorDAO = new ProfessorDAO(fastify.pg);
      resp = await professorDAO.readByID(req.params.id);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return error;
    }
  });

  fastify.patch("/", { schema: PATCH }, async (req, reply) => {
    try {
      const professorDAO = new ProfessorDAO(fastify.pg);
      resp = await professorDAO.update(req.body, req.auth.ID_professor);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return error;
    }
  });

  fastify.delete("/", { schema: DELETE }, async (req, reply) => {
    try {
      const professorDAO = new ProfessorDAO(fastify.pg);
      resp = await professorDAO.delete(req.auth.ID_professor);
      reply.code(200);
      return { rows: resp.rows, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return error;
    }
  });
}

module.exports = routes;
