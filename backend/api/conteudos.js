const conteudoDAO = require("../DAO/ConteudoDAO");
const { GET } = require("../schemas/conteudos");

module.exports = async function routes(fastify) {
  const pg = fastify.pg;

  fastify.get("/:id_conteudo", { schema: GET }, async (req, res) => {
    try {
      const DAO = new conteudoDAO(pg, 'fs', { id_conteudo: req.params.id_conteudo });
      return await DAO.read( {
        id_aluno: req.auth.ID_aluno || null,
        id_professor: req.auth.ID_professor || null,
      });
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Falha ao buscar conteúdo", error };
    }
  });
};
