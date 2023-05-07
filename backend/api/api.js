const {
  routes: routesMedalhas,
  routesADMIN: routesMedalhasADMIN,
} = require("./medalha");

async function privateRoutes(fastify) {
  fastify.register(require("../auth"));

  fastify.register(require("./aventuras"), { prefix: "aventuras" });
  fastify.register(require("./missao"), { prefix: "aventuras/:id_aventura/missoes" });
  fastify.register(require("./grupos"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/grupos" });
  fastify.register(require("./desafios"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/desafios" });
  fastify.register(require("./perfil"), { prefix: "perfil" });
  fastify.register(routesMedalhas, { prefix: "medalhas" });
  fastify.register(routesMedalhasADMIN, { prefix: "admin/medalhas" });

  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
};

module.exports = async function routes(fastify) {
  fastify.register(require("./login"), { prefix: "login" });

  fastify.register(privateRoutes);
};
