const schemas = require('../schemas/aventuras');
const AventuraDAO = require('../DAO/AventuraDAO');


module.exports = async function privateRoutes(fastify){

    const pg =  fastify.pg;

    fastify.get('/', { schema: schemas.GET }, async (req, reply) => {
        try{
            console.log('auth: ', req.auth)
            const DAO = new AventuraDAO( pg );

            return await DAO.busca( req.auth.tipo === 1, req.auth.ID_aluno || req.auth.ID_professor );
        }
        catch( err ){
            console.error(err);
            throw err;
        }
    })

    fastify.get('/:id', { schema: schemas.GET_ID }, async (req, reply) => {
        try{
            const DAO = new AventuraDAO( pg );

            return await DAO.busca( req.auth.tipo === 1, req.auth.ID_aluno || req.auth.ID_professor, req.params.id  );
        }
        catch( err ){
            console.error(err);
            throw err;
        }
    })

    fastify.post('/', { schema: schemas.POST }, async (req, reply) => {
        // TODO: verificar se professor existe antes de criar aventura
        if( req.auth.tipo !== 0 )
            throw {status: 403, message: "Apenas professores podem criar aventuras"};

        try{
            const DAO = new AventuraDAO( pg );

            req.body.FK_Professor = req.auth.id;

            await DAO.adiciona( req.body );

            return { status: 200, message: "Aventura criada com sucesso"};
        }
        catch( err ){
            console.error(err);
            throw err;
        }
    })
}
