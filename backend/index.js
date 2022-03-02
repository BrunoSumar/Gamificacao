require("dotenv").config({
  path: process.env.NODE_ENV == "dev" ? ".env.development" : ".env",
});
const path = require("path");
const config = require("./config");
const fastify = require("fastify")();
//CORS
fastify.register(require("fastify-cors"), {
  origin: (origin, cb) => {
    const hostname = new URL(origin).hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"));
  },
});

// Conexão com o banco
fastify.decorate("pg", require("./banco"));

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
fastify.register(require("fastify-jwt"), {
  secret: config.SECRET,
});

fastify.register(require("./auth"));

// Rotas da aplicação
fastify.register(require("./api/api"), { prefix: "api" });

// Iniciando servidor
fastify.listen(config.PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening at ${config.PORT}`);
});
