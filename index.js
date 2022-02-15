const path = require('path');
const config = require('./config');
const pg = require('pg');

const fastify = require('fastify')();

// TODO: Adicionar suporte front-end
// fastify.register(require('fastify-static'), {
//     // TODO: trocar pasta raiz para padrão do react
//     root: path.join(__dirname, './dist'),
//     prefix: '/',
// });
// fastify.get('/', (req, reply) => reply.sendFile('index.html'));

// // Inicio conexão com bd
// fastify.decorate('pg_test', new pg.Pool({
//     user: config.PG_USER,
//     host: config.PG_TEST_IP_ADDRESS,
//     database: 'postgresDB_ttb',
//     password: config.PG_PASSWORD,
//     port: '5432',
//     max: 6
// }));

// fastify.register(async (fastify) => {
//     fastify.pg.on('error', (err) => {
//         console.error('Error PostgreSQL:');
//         console.error(err);
//         process.exit(1);
//     });

//     fastify.pg.on('end', () => {
//         console.log('PostgreSQL: conexão encerrada');
//         process.exit(1);
//     });
// };

fastify.register(require('fastify-jwt'), {
    secret: config.SECRET
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
