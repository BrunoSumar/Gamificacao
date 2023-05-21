const { onRequest } = require("../misc/someUsefulFuncsHooks");
const MissaoDAO = require("../DAO/MissaoDAO");
const { GET, POST, PATCH, PUT_CONTEUDO, DELETE } = require("../schemas/missoes");
async function routes(fastify) {
  const pg = fastify.pg;
  fastify.register(routesProfessor);

  fastify.get("/", { schema: GET }, async (req, res) => {
    try {
      const missaoDAO = new MissaoDAO(pg);
      const resp = await missaoDAO.read(req.params.id_aventura, {
        id_aluno: req.auth?.ID_aluno,
        id_professor: req.auth?.ID_professor,
      });
      res.code(200);

      return { resp };
    } catch (error) {
      res.code(500);
      return { message: "Não foi possivel buscar missão", error };
    }
  });
}

async function routesProfessor(fastify) {
  const pg = fastify.pg;
  fastify.addHook("onRequest", onRequest.somente_professor);

  fastify.post("/", { schema: POST }, async (req, res) => {
    try {
      const missaoDAO = new MissaoDAO(pg);
      let resp = await missaoDAO.create(
        req.body,
        req.params.id_aventura,
        req.auth.ID_professor
      );
      res.code(200);
      return resp;
    } catch (error) {
      res.code(500);
      return { message: "Não foi possivel criar missão", error };
    }
  });

  fastify.patch("/:id_missao", { schema: PATCH }, async (req, res) => {
    try {
      const missaoDAO = new MissaoDAO(pg);
      let resp = await missaoDAO.update(
        req.body,
        req.params.id_aventura,
        req.auth.ID_professor,
        req.params.id_missao
      );
      res.code(200);
      return resp;
    } catch (error) {
      res.code(500);
      return { message: "Não foi atualizar missão", error };
    }
  });

  fastify.put("/:id_missao/conteudo", { schema: PUT }, async (req, res) => {
    try {
      if( !req.isMultipart() )
        throw 'Nenhum arquivo fornecido';

      const DAO = new respostaDAO(pg);
      return await DAO.updateConteudo(
        req.params.id_aventura,
        req.params.id_missao,
        req.auth.ID_professor,
        req.body.conteudo,
      );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Não foi possivel salvar conteúdo", error };
    }
  });

  fastify.delete("/:id_missao", { schema: DELETE }, async (req, res) => {
    try {
      const missaoDAO = new MissaoDAO(pg);
      let resp = await missaoDAO.delete(
        req.params.id_missao,
        req.auth.ID_professor,
        req.params.id_aventura
      );
      res.code(200);
      return resp;
    } catch (error) {
      res.code(500);
      return { message: "Não foi deletar missão", error };
    }
  });

};

module.exports = routes;
