const schemas = require('../schemas/aventuras');
const AventuraDAO = require('../DAO/AventuraDAO');


module.exports = async function privateRoutes(fastify){

    const pg =  fastify.pg;

    // fastify.post('/', { schema: schemas.POST }, async (req, reply) => {
    fastify.post('/', {}, async (req, reply) => {

        const DAO = new AventuraDAO( pg );
        try{
            await DAO.adiciona({nome: 'jose', tipo: 'roberto'});
            // await pg.query(`
            //     INSERT INTO aventura
            // `, [  ]);
        }
        catch( err ){
            console.error(err);
            throw err;
        }
        return null;
    })
}
