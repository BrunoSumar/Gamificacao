
async function privateRoutes(fastify) {
  fastify.register(require("../auth"));
  fastify.register(require("./alunos"), { prefix: "alunos" });
  fastify.register(require("./professores"), { prefix: "professores" });
  fastify.register(require("./aventuras"), { prefix: "aventuras" });
  fastify.register(require("./missao"), { prefix: "aventuras/:id_aventura/missoes" });
  fastify.register(require("./comentarios"), { prefix: "aventuras/:id_aventura/comentarios" });
  fastify.register(require("./grupos"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/grupos" });
  fastify.register(require("./desafios"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/desafios" });
  fastify.register(require("./opcoes"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/desafios/:id_desafio/opcoes" });
  fastify.register(require("./respostas"), { prefix: "aventuras/:id_aventura/missoes/:id_missao/desafios/:id_desafio/respostas" });
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
