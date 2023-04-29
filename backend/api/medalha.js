const MedalhasDAO = require("../DAO/MedalhasDAO");
const { deleteMedal, patch, post } = require("../schemas/medalhas");
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
            error
        }
    }
  });

  fastify.delete("/:id", { schema: deleteMedal }, async (req, reply) => {
    try {
      const medalhasDAO = new MedalhasDAO(fastify.pg);
      console.log(req.params.id)
      resp = await medalhasDAO.delete(req.params.id);
      reply.code(200);
      return { msg: resp.msg };
    } catch (error) {
        reply.code(500);
        console.log(error)
        return {
            error
        }
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
            error
        }
    }
  });

  fastify.addHook("onRequest", (req, res, done) => {
    // if (req.auth.type != 0) {
    //   res.code(401);
    //   throw new Error("O Usuario precisa ser um administrador");
    // }
    done();
  });
}

module.exports = {
  routesADMIN,
  routes,
};
