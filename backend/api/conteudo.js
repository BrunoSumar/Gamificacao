const conteudoDAO = require("../DAO/ConteudoDAO");
const { GET } = require("../schemas/conteudos");

async function routes(fastify) {
  const pg = fastify.pg;

  fastify.get("/:id_conteudo", { schema: GET }, async (req, res) => {
    try {
      const DAO = new conteudoDAO(pg);
      return await DAO.read( req.params.id_conteudo );
    } catch (error) {
      console.error(error);
      res.code(500);
      return { message: "Falha ao buscar conteúdo", error };
    }
  });
};
