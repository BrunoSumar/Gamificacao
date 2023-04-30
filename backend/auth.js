const fp = require("fastify-plugin");
const config = require("./config");

async function verify(req, reply) {
  try {

    req.auth = await req.jwtVerify();
    delete req.auth.iat;

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
