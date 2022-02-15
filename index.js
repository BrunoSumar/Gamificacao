const path = require('path');
const config = require('./config');

const fastify = require('fastify')();

fastify.register(require('fastify-jwt'), {
    secret: config.SECRET
});

fastify.register(require('./auth'));

// TODO: colocar essa lógica na rota api/login
fastify.post('/signup', (req, reply) => {
    const token = fastify.jwt.sign({ id: 1, nome: 'abc' })
    reply.send({ token })
});

// fastify.register(require('fastify-static'), {
//     // TODO: tocrar pasta raiz para padrão do react
//     root: path.join(__dirname, './dist'),
//     prefix: '/',
// });
// fastify.get('/', (req, reply) => reply.sendFile('index.html'));

fastify.register(require('./api/api'), { prefix: 'api' });

fastify.listen(config.PORT, (err) => {
    if(err){
        console.error(err);
        process.exit(1);
    }
    console.log(`Listening at ${config.PORT}`);
});
