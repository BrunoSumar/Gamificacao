const fp = require("fastify-plugin")
const config = require('./config');

async function verify(req, reply){
    try {
        console.log(req)
        await req.jwtVerify()
    } catch (err) {
        reply.send(err)
    }
}

module.exports = fp(async function(fastify, opts) {
    fastify.decorate("verifyJWT", async function(fastify) {
        fastify.addHook("onRequest", verify);
    })
})
