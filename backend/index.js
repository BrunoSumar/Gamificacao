require("dotenv").config({
  path: process.env.NODE_ENV == "dev" ? ".env.development" : ".env",
});

const path = require("path");
const fastify = require("fastify")();
const config = require("./config");
const bcrypt = require("bcryptjs");

//CORS
fastify.register(require("@fastify/cors"), {
  origin: (origin, cb) => {
    //   cb(null, true);
    const hostname = origin && new URL(origin).hostname;
    if (hostname === "localhost" || config.DEV_MODE) {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"));
  },
});

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

// Documentação da API {{{ precisa configurar a ui  }}}
fastify.register(require('@fastify/swagger'), {})
fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'My FirstAPP Documentation',
            description: 'My FirstApp Backend Documentation description',
            version: '0.1.0',
            termsOfService: 'https://mywebsite.io/tos',
            contact: {
                name: 'John Doe',
                url: 'https://www.johndoe.com',
                email: 'john.doe@email.com'
            }
        },
        externalDocs: {
            url: 'https://www.johndoe.com/api/',
            description: 'Find more info here'
        },
        host: '127.0.0.1:3000',
        basePath: '/api',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [{
            name: 'User',
            description: 'User\'s API'
        }, ],
        definitions: {
            User: {
                type: 'object',
                required: ['id', 'email'],
                properties: {
                    id: {
                        type: 'number',
                        format: 'uuid'
                    },
                    firstName: {
                        type: 'string'
                    },
                    lastName: {
                        type: 'string'
                    },
                    email: {
                        type: 'string',
                        format: 'email'
                    }
                }
            },
        }
    },
    uiConfig: {
        docExpansion: 'none', // expand/not all the documentations none|list|full
        deepLinking: true
    },
    uiHooks: {
        onRequest: function(request, reply, next) {
            next()
        },
        preHandler: function(request, reply, next) {
            next()
        }
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
    exposeRoute: true
});

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
