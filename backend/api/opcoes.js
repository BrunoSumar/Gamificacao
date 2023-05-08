const { onRequest } = require("../misc/someUsefulFuncsHooks");
const opcaoDAO = require("../DAO/OpcaoDAO");
const { GET, POST, PUT } = require("../schemas/opcoes");

async function routes(fastify) {
    const pg = fastify.pg;

    fastify.register(routesProfessores);

    fastify.get("/", { schema: GET }, async (req, res) => {
        try {
            const DAO = new opcaoDAO(pg);
            return await DAO.read(
                req.params.id_aventura,
                req.params.id_missao,
                req.params.id_desafio,
                {
                    ID_professor: req.auth.ID_professor,
                    ID_aluno: req.auth.ID_aluno,
                }
            );
        } catch (error) {
            console.error(error);
            res.code(500);
            return { message: "Falha ao buscar opcoes", error };
        }
    });
};

async function routesProfessores(fastify) {
    const pg = fastify.pg;

    fastify.addHook("onRequest", onRequest.somente_professor);

    fastify.post("/", { schema: POST }, async (req, res) => {
        try {
            const DAO = new opcaoDAO(pg);
            return await DAO.create(
                req.params.id_aventura,
                req.params.id_missao,
                req.params.id_desafio,
                req.auth.ID_professor,
                req.body,
            );
        } catch (error) {
            console.error(error);
            res.code(500);
            return { message: "Não foi possivel criar a(s) opção(ões)", error };
        }
    });

    fastify.put("/", { schema: PUT }, async (req, res) => {
        try {
            const DAO = new desafioDAO(pg);
            return await DAO.update(
                req.params.id_aventura,
                req.params.id_missao,
                req.params.id_desafio,
                req.auth.ID_professor,
                req.body,
            );
        } catch (error) {
            console.error(error);
            res.code(500);
            return { message: "Não foi possivel alterar a(s) opção(ões)", error };
        }
    });
};

module.exports = routes;
