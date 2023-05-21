const { onRequest } = require("../misc/someUsefulFuncsHooks");
const MissaoDAO = require("../DAO/MissaoDAO");
const respostaDAO = require("../DAO/RespostaDAO");
const { GET, POST, DELETE, PATCH, GET_NOTAS } = require("../schemas/missoes");
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

  fastify.get(
    "/:id_missao/notas",
    { schema: GET_NOTAS },
    async (req, res) => {
      const desafios = req.query.desafios;
      const DAO = new respostaDAO(pg);
      try {
        let resposta = DAO.verifica_resposta_aluno(
          req.params.id_aventura,
          req.params.id_missao,
          desafios,
          req.auth?.ID_aluno
        );
        return{
          message: "Respostas encontradas!",
          rows: resposta
        }
      } catch (error) {
        res.code(500);
        console.log(error);
        return error;
      }
    }
  );
}

async function routesProfessor(fastify) {
  const pg = fastify.pg;

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

  fastify.addHook("onRequest", onRequest.somente_professor);
}

module.exports = routes;
