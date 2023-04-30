const { onRequest } = require("../misc/someUsefulFuncsHooks");
const grupoDAO = require("../DAO/gruposDAO");
const { GET, POST, DELETE, PATCH } = require("../schemas/grupos");

async function routes(fastify) {
    const pg = fastify.pg;

    fastify.register(routesAlunos);

    fastify.get("/", { schema: GET }, async (req, res) => {
        try {
            const DAO = new grupoDAO(pg);
            return await DAO.create( req.params.id_aventura, {
                ID_missao: req.params.id_missao,
                ID_professor: req.auth.ID_professor,
                ID_aluno: req.auth.ID_aluno,
            );
        } catch (error) {
            res.code(500);
            return { message: "Falha ao buscar grupos", error };
        }
    });
};


async function routesAlunos(fastify) {
    const pg = fastify.pg;

    fastify.addHook("onRequest", onRequest.somente_aluno);

    fastify.post("/", { schema: POST }, async (req, res) => {
        try {
            const DAO = new grupoDAO(pg);
            return await DAO.create( req.params.id_aventura, req.params.id_missao, req.auth.ID_aluno );
        } catch (error) {
            res.code(500);
            return { message: "Não foi possivel criar grupo", error };
        }
    });

    fastify.post("/:id_grupo", { schema: POST_PARTICIPAR }, async (req, res) => {
        try {
            const DAO = new grupoDAO(pg);
            return await DAO.update( req.params.id_aventura, req.params.id_missao, req.auth.ID_aluno );
        } catch (error) {
            res.code(500);
            return { message: "Não foi possível participar do grupo", error };
        }
    });

    fastify.delete("/:id_grupo", { schema: DELETE }, async (req, res) => {
        try {
            const DAO = new grupoDAO(pg);
            return await DAO.delete( req.params.id_aventura, req.params.id_missao, req.auth.ID_aluno );
        } catch (error) {
            res.code(500);
            return { message: "Não foi possível deixar o grupo", error };
        }
    });
};

module.exports = routes;
