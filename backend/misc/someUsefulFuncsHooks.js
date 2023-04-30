const { user_type_code } = require("./someUsefulFuncsUsers");

const onRequest = {
  somente_professor: async (req) => {
    console.log(req.auth);
    if (
      user_type_code["Professor"] !== req.auth.type &&
      user_type_code["Admin"] !== req.auth.type
    ) {
      throw {
        status: 403,
        message: "Operação restrita para professores",
      };
    }
  },
  somente_administrador: (req, res, done) => {
    if (user_type_code["Admin"] !== req.auth.type) {
      res.code(401);
      throw {
        status: 403,
        message: "Operação restrita para administradores",
      };
    }
    done();
  },
  somente_aluno: (req, res, done) => {
    if (
      user_type_code["Aluno"] !== req.auth.type &&
      user_type_code["Admin"] !== req.auth.type
    ) {
      res.code(401);
      throw {
        status: 403,
        message: "Operação restrita para alunos",
      };
    }
    done();
  },
};

const onSend = {
  registra_login: async (request, reply, payload) => {
    if (
      reply.statusCode === 200 &&
      request.method === "POST" &&
      ["/api/login/aluno", "/api/login/professor"].includes(request.url)
    ) {
      loginDAO = new LoginRegisterDAO(fastify.pg);
      try {
        await loginDAO.insere(JSON.parse(payload).token);
      } catch (error) {
        payload = null;
        reply.statusCode = 500;
      }
    }
  },
};

module.exports = {
  onRequest,
  onSend
}
