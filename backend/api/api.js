
module.exports = async function routes(fastify) {
  fastify.register(require("./login"), { prefix: "login" });

  fastify.register(privateRoutes);
};

async function privateRoutes(fastify) {
  fastify.register(require("../auth"));

  fastify.register(require("./aventuras"), { prefix: "aventuras" });

  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
}
