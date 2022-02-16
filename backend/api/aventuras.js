const schemas = require('../schemas/aventuras');

module.exports = async function privateRoutes(fastify){

    const pg =  fastify.pg;

    fastify.post('/', { schema: schemas.POST }, async (req, reply) => {
        try{
            // await pg.query(`
            //     INSERT INTO aventura
            // `, [  ]);
        }
        catch( err ){
            cosole.error(err);
            throw err;
        }
    })
}
