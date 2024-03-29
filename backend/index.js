require("dotenv").config({
  path: process.env.NODE_ENV == "dev" ? ".env.development" : ".env",
});

const path = require("path");
const fastify = require("fastify")();
const config = require("./config");
const bcrypt = require("bcryptjs");
console.log(config)

//CORS
// fastify.register(require("@fastify/cors"), {
//   origin: (origin, cb) => {
//       cb(null, true);
//     console.log( origin )
//     const hostname = origin && new URL(origin).hostname;
//     if (hostname === "localhost" || config.DEV_MODE) {
//        // Request from localhost will pass
//       cb(null, true);
//       return;
//     }
//     // Generate an error on other origins, disabling access
//     cb(new Error("Not allowed"));
//   },
// });

// Conexão com o banco
const pg = require("./banco");
fastify.decorate("pg", pg);

fastify.register(async (fastify) => {
  fastify.pg.on("error", (err) => {
    console.error("Error PostgreSQL:");
    console.error(err);
    process.exit(1);
  });

  fastify.pg.on("end", () => {
    console.log("PostgreSQL: conexão encerrada");
    process.exit(1);
  });
});

// Token JWT
fastify.register(require("@fastify/jwt"), {
  secret: config.SECRET,
  sign: {
    expiresIn: '1d',
  },
});

// Requições Multipart
fastify.register(require("@fastify/multipart"), {
  attachFieldsToBody: true,
  limits: {
    fieldNameSize: 256,
    headerPairs: 256,
    fileSize: 3 * 1024 * 1024, //Carga útil máxima de 3MB
  }
});

// Servido frontend estaticamente
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, './build/'),
})

// Documentação da API
fastify.register(require('@fastify/swagger'), {});
fastify.register(...require("./docs"));

// Rotas da aplicação
fastify.register(require("./api/api"), { prefix: "api" });

// Pasta de conteúdos
require('fs').mkdirSync('./conteudos', { recursive: true });

// Rotina de limpeza de conteúdos
const cron = require('node-cron');
cron.schedule('0 0 * * 0', require('./clean')(pg));

// Iniciando servidor
fastify.listen({ port: config.PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening at ${config.PORT}`);
});

// Gera/expõem rota documentação
fastify.ready(err => {
  if (err) {
    console.error(err);
    throw err;
  }
  fastify.swagger()
})
