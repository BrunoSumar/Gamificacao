const path = require('path');
const config = require('./config');

const fastify = require('fastify')();

fastify.decorate('pg', require('./db/banco'));

fastify.register(async (fastify) => {
    fastify.pg.on('error', (err) => {
        console.error('Error PostgreSQL:');
        console.error(err);
        process.exit(1);
    });

    fastify.pg.on('end', () => {
        console.log('PostgreSQL: conexão encerrada');
        process.exit(1);
    });
});

fastify.register(require('fastify-jwt'), {
    secret: config.SECRET,
});

fastify.register(require('./auth'));

fastify.register(require('./api/api'), { prefix: 'api' });

fastify.listen(config.PORT, (err) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Listening at ${config.PORT}`);
});

// Exemplo de uso bem mal feito
// let alunoDAO = require('./DAO/AlunoDAO');
// alunoDAO = (new alunoDAO(fastify.pg));
// ( async () => console.log(await alunoDAO.buscaAluno()) )();
