const { onRequest } = require("../misc/someUsefulFuncsHooks");
const desafioDAO = require("../DAO/DesafioDAO");
const { GET, GET_ID, POST, PUT, PUT_CONTEUDO, DELETE_CONTEUDO } = require("../schemas/desafios");

async function routes(fastify) {
  const pg = fastify.pg;

  fastify.register(require("./opcoes"), { prefix: ":id_desafio/opcoes" });
  fastify.register(require("./respostas"), { prefix: ":id_desafio/respostas" });

  fastify.register(routesProfessores);

  fastify.get("/", { schema: GET }, async (req, res) => {
    try {
      const DAO = new desafioDAO(pg);
      return await DAO.read(req.params.id_aventura, req.params.id_missao, {
        ID_professor: req.auth.ID_professor,
        ID_aluno: req.auth.ID_aluno,
      });
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Falha ao buscar desafios", error };
    }
  });

  fastify.get("/:id_desafio", { schema: GET_ID }, async (req, res) => {
    try {
      const DAO = new desafioDAO(pg);
      return await DAO.read(req.params.id_aventura, req.params.id_missao, {
        ID_professor: req.auth.ID_professor,
        ID_aluno: req.auth.ID_aluno,
        ID_desafio: req.params.id_desafio,
      });
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Falha ao buscar o desafio", error };
    }
  });
};

async function routesProfessores(fastify) {
  const pg = fastify.pg;

  fastify.addHook("onRequest", onRequest.somente_professor);

  fastify.post("/", { schema: POST }, async (req, res) => {
    try {
      const DAO = new desafioDAO(pg);
      return await DAO.create(
        req.params.id_aventura,
        req.params.id_missao,
        req.auth.ID_professor,
        req.body,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel criar o(s) desafio(s)", error };
    }
  });

  fastify.put("/", { schema: PUT }, async (req, res) => {
    try {
      const DAO = new desafioDAO(pg);
      return await DAO.update(
        req.params.id_aventura,
        req.params.id_missao,
        req.auth.ID_professor,
        req.body,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi alterar o(s) desafio(s)", error };
    }
  });

  fastify.put("/:id_desafio/conteudo", { schema: PUT_CONTEUDO }, async (req, res) => {
    try {
      if( !req.isMultipart() )
        throw 'Nenhum arquivo fornecido';

      const DAO = new desafioDAO(pg);
      return await DAO.updateConteudo(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_professor,
        req.body.conteudo,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel salvar conteúdo", error };
    }
  });

  fastify.delete("/:id_desafio/conteudo", { schema: DELETE_CONTEUDO }, async (req, res) => {
    try {
      const DAO = new desafioDAO(pg);
      return await DAO.deleteConteudo(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_professor,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel remover conteúdo", error };
    }
  });

};

module.exports = routes;
