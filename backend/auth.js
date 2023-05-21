const fp = require("fastify-plugin");
const config = require("./config");

async function verify(req, reply) {
  try {

    req.auth = await req.jwtVerify();

    const data_expiracao = +req.auth.exp * 1000;
    const data_atual = Date.now();
    if( data_expiracao < data_atual )
      throw 'Token expirado';

    delete req.auth.iat;
    delete req.auth.exp;

  } catch (error) {

    console.error( error );
    reply.statusCode = 401;
    throw {
      message: 'Falha na autenticação do token JWT',
      error,
    };

  }
};

module.exports = fp(async function (fastify, opts) {
    fastify.addHook("onRequest", verify);
});
