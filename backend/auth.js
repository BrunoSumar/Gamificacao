const fp = require("fastify-plugin");
const config = require("./config");
const { user_type_code } = require("./misc/someUsefulFuncsUsers");

async function verify(req, reply) {
  try {

    req.auth = await req.jwtVerify();

    delete req.auth.iat;
    delete req.auth.exp;

    if (user_type_code["Admin"] !== req.auth.type)
      return;

    req.auth.ID_aluno = req.query.ID_aluno;
    req.auth.ID_professor = req.query.ID_professor;
  }
  catch (error) {

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
