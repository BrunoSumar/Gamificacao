const fp = require("fastify-plugin")
const config = require('./config');

async function verify(req, reply){
    try {
        req.auth = await req.jwtVerify();
        delete req.auth.iat;
    } catch (err) {
        throw err;
    }
}

module.exports = fp(async function(fastify, opts) {
    fastify.decorate("verifyJWT", async function(fastify) {
        fastify.addHook("onRequest", verify);
    })
})
