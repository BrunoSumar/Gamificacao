const MedalhasDAO = require("../DAO/MedalhasDAO");
const { deleteMedal, patch, post } = require("../schemas/medalhas");
const { onRequest } = require("../misc/someUsefulFuncsHooks");

module.exports = async function routes(fastify) {
  fastify.register(routesADMIN);
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
}

async function routesADMIN(fastify) {
  fastify.post("/", { schema: post }, async (req, reply) => {
    try {
      const medalhasDAO = new MedalhasDAO(fastify.pg);
      resp = await medalhasDAO.create(req.body);
      reply.code(200);
      return { rows: resp.row, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.delete("/:id", { schema: deleteMedal }, async (req, reply) => {
    try {
      const medalhasDAO = new MedalhasDAO(fastify.pg);
      resp = await medalhasDAO.delete(req.params.id);
      reply.code(200);
      return { msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.patch("/:id", { schema: patch }, async (req, reply) => {
    try {
      const medalhasDAO = new MedalhasDAO(fastify.pg);
      resp = await medalhasDAO.update(req.body, req.params.id);
      reply.code(200);
      return { rows: resp.row, msg: resp.msg };
    } catch (error) {
      reply.code(500);
      return {
        error,
      };
    }
  });

  fastify.addHook("onRequest", onRequest.somente_administrador);
}
