const { onRequest } = require("../misc/someUsefulFuncsHooks");
const desafioDAO = require("../DAO/GruposDAO");
const { GET, POST, POST_PARTICIPAR, DELETE } = require("../schemas/grupos");
// const { GET, POST, POST_PARTICIPAR, DELETE } = require("../schemas/desafios");

async function routes(fastify) {
  const pg = fastify.pg;

  // fastify.register(routesProfessores);

  fastify.get("/", { schema: GET }, async (req, res) => {
    try {
      const DAO = new desafiosDAO(pg);
      return await DAO.read(req.params.id_aventura, req.params.id_missao, {
        ID_professor: req.auth.ID_professor,
        ID_aluno: req.auth.ID_aluno,
      });
    } catch (error) {
      console.error(error);
      res.code(500);
      console.log(error);
      return { message: "Falha ao desafios", error };
    }
  });
}

// async function routesProfessores(fastify) {
//   const pg = fastify.pg;

//   fastify.addHook("onRequest", onRequest.somente_professor);

//   fastify.post("/", { schema: POST }, async (req, res) => {
//     try {
//       const DAO = new gruposDAO(pg);
//       return await DAO.create(
//         req.params.id_aventura,
//         req.params.id_missao,
//         req.auth.ID_aluno
//       );
//     } catch (error) {
//       console.error(error);
//       res.code(500);
//       return { message: "Não foi possivel criar grupo", error };
//     }
//   });

//   fastify.post("/:id_grupo", { schema: POST_PARTICIPAR }, async (req, res) => {
//     try {
//       const DAO = new gruposDAO(pg);
//       return await DAO.update(
//         req.params.id_aventura,
//         req.params.id_missao,
//         req.auth.ID_aluno,
//         req.params.id_grupo
//       );
//     } catch (error) {
//       console.error(error);
//       res.code(500);
//       return { message: "Não foi possível participar do grupo", error };
//     }
//   });

//   fastify.delete("/", { schema: DELETE }, async (req, res) => {
//     try {
//       const DAO = new gruposDAO(pg);
//       return await DAO.delete(
//         req.params.id_aventura,
//         req.params.id_missao,
//         req.auth.ID_aluno
//       );
//     } catch (error) {
//       console.error(error);
//       res.code(500);
//       return { message: "Não foi possível deixar o grupo", error };
//     }
//   });
// }

module.exports = routes;
