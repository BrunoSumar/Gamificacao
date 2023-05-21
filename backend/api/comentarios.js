const ComentarioDAO = require("../DAO/ComentarioDAO");
const {
  deleteComentario,
  get,
  patch,
  post,
} = require("../schemas/comentarios");

module.exports = async function routes(fastify) {

  fastify.get("/", { schema: get }, async (req, reply) => {
    try {
      const comentarioDAO = new ComentarioDAO(fastify.pg);
      const resp = await comentarioDAO.read(req.params.id_aventura, {
        ID_aluno: req.auth?.ID_aluno,
        ID_professor: req.auth?.ID_professor,
      });
      reply.code(200);
      return { rows: resp, msg: "Comentarios resgatado" };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.post("/", { schema: post }, async (req, reply) => {
    try {
      const comentarioDAO = new ComentarioDAO(fastify.pg);
      const resp = await comentarioDAO.create(
        req.body,
        req.params.id_aventura,
        {
          ID_aluno: req.auth?.ID_aluno,
          ID_professor: req.auth?.ID_professor,
        }
      );
      reply.code(200);
      return resp;
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.patch("/:id", { schema: patch }, async (req, reply) => {
    try {
      const comentarioDAO = new ComentarioDAO(fastify.pg);
      const resp = await comentarioDAO.update(
        req.body,
        req.params.id_aventura,
        req.params.id,
        {
          ID_aluno: req.auth?.ID_aluno,
          ID_professor: req.auth?.ID_professor,
        }
      );
      reply.code(200);
      return resp;
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.delete("/:id", { schema: deleteComentario }, async (req, reply) => {
    try {
      const comentarioDAO = new ComentarioDAO(fastify.pg);
      const resp = await comentarioDAO.delete(
        req.params.id_aventura,
        req.params.id,
        {
          ID_aluno: req.auth?.ID_aluno,
          ID_professor: req.auth?.ID_professor,
        }
      );
      reply.code(200);
      return resp;
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });
};
