const schemas = require('../schemas/aventuras');
const AventuraDAO = require('../DAO/AventuraDAO');


module.exports = async function privateRoutes(fastify){

    const pg =  fastify.pg;

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
