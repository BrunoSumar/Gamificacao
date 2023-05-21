const respostaDAO = require("../DAO/RespostaDAO");
const { onRequest } = require("../misc/someUsefulFuncsHooks");
const { GET, POST, PATCH, DELETE, PUT } = require("../schemas/respostas");

async function routes(fastify) {
  const pg = fastify.pg;

  fastify.register(routesAlunos);

  fastify.get("/", { schema: GET }, async (req, res) => {
    try {
      const DAO = new respostaDAO(pg);
      return await DAO.read(req.params.id_aventura, req.params.id_missao, req.params.id_desafio, {
        ID_professor: req.auth.ID_professor,
        ID_aluno: req.auth.ID_aluno,
      });
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Falha ao buscar resposta", error };
    }
  });

};

async function routesAlunos(fastify) {
  const pg = fastify.pg;

  fastify.addHook("onRequest", onRequest.somente_aluno);

  fastify.post("/", { schema: POST }, async (req, res) => {
    try {
      const DAO = new respostaDAO(pg);
      return await DAO.create(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_aluno,
        req.body,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel responder desafio", error };
    }
  });

  fastify.put("/conteudo", { schema: PUT }, async (req, res) => {
    try {
      if( !req.isMultipart() )
        throw 'Nenhum arquivo fornecido';

      if( !req.body.conteudo )
        throw 'Conteúdo inválido';

      const DAO = new respostaDAO(pg);
      return await DAO.updateConteudo(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_aluno,
        req.body.conteudo,
        { id_grupo: +req.body.id_grupo?.value }
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel responder desafio", error };
    }
  });

  fastify.patch("/", { schema: PATCH }, async (req, res) => {
    try {
      const DAO = new respostaDAO(pg);
      return await DAO.update(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_aluno,
        req.body,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possível alterar resposta", error };
    }
  });

  fastify.delete("/", { schema: DELETE }, async (req, res) => {
    try {
      const DAO = new respostaDAO(pg);
      return await DAO.delete(
        req.params.id_aventura,
        req.params.id_missao,
        req.params.id_desafio,
        req.auth.ID_aluno,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel remover resposta", error };
    }
  });
};

module.exports = routes;
