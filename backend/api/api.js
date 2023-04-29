
module.exports = async function routes(fastify) {
  fastify.register(require("./login"), { prefix: "login" });

  fastify.register(privateRoutes);
};

const {
  routes,
  routesADMIN
} = require("./medalha")

async function privateRoutes(fastify) {
  fastify.verifyJWT(fastify);

  // Exemplo adição de rota aqui
  fastify.register(require("./aventuras"), { prefix: "aventuras" });
  fastify.register(require("./perfil"), { prefix: "perfil" });
  fastify.register(routes, { prefix: "medalhas" });
  fastify.register(routesADMIN, { prefix: "admin/medalhas" });

  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
}
