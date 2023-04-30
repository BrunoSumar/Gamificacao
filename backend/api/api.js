const {
  routes,
  routesADMIN
} = require("./medalha");

async function privateRoutes(fastify) {
  fastify.register(require("../auth"));

  fastify.register(require("./aventuras"), { prefix: "aventuras" });
  fastify.register(require("./missao"), { prefix: "aventuras/:id_aventura/missao" });
  fastify.register(require("./perfil"), { prefix: "perfil" });
  fastify.register(routes, { prefix: "medalhas" });
  fastify.register(routesADMIN, { prefix: "admin/medalhas" });

  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
};

module.exports = async function routes(fastify) {
  fastify.register(require("./login"), { prefix: "login" });

  fastify.register(privateRoutes);
};
