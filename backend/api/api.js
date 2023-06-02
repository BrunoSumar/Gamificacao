
async function privateRoutes(fastify) {
  fastify.register(require("../auth"));
  fastify.register(require("./alunos"), { prefix: "alunos" });
  fastify.register(require("./professores"), { prefix: "professores" });
  fastify.register(require("./aventuras"), { prefix: "aventuras" });
  fastify.register(require("./perfil"), { prefix: "perfil" });
  fastify.register(require("./administrador"), { prefix: "administrador" });
  fastify.register(require("./conteudos"), { prefix: "conteudos" });
  fastify.register(require("./medalhas"), { prefix: "medalhas" });
  fastify.get("/ping", async () => ({ status: 200 }));
  fastify.get("/token", async (req) => req.auth);
};

module.exports = async function routes(fastify) {
  fastify.register(require("./login"), { prefix: "login" });
  fastify.register(privateRoutes);
};
