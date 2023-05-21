const { google } = require("googleapis");
const respostaDAO = require("../DAO/RespostaDAO");
const fetch = require("node-fetch");
const schemas = require("../schemas/aventuras");
const AventuraDAO = require("../DAO/AventuraDAO");
const { verify: VerifyToken } = require("../misc/someUsefulFuncsGoogleAuth");
const { user_type_code } = require("../misc/someUsefulFuncsUsers");
const { onRequest } = require("../misc/someUsefulFuncsHooks");

module.exports = async function routes(fastify) {
  const pg = fastify.pg;

  fastify.register(routesProfessores);
  fastify.register(routesAlunos);

  fastify.get("/", { schema: schemas.GET }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      return await DAO.read({
        id_aluno: req.auth.ID_aluno || null,
        id_professor: req.auth.ID_professor || null,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.get(
    "/:id_aventura/notas",
    { schema: schemas.GET_NOTAS },
    async (req, res) => {
      const DAO = new respostaDAO(pg);
      try {
        let resposta = DAO.verifica_resposta_aluno(
          req.params.id_aventura,
          null,
          null,
          req.auth?.ID_aluno
        );
        return {
          message: "Respostas encontradas!",
          rows: resposta,
        };
      } catch (error) {
        res.code(500);
        console.log(error);
        return error;
      }
    }
  );

  fastify.get(
    "/:id_aventura",
    { schema: schemas.GET_ID },
    async (req, reply) => {
      try {
        const DAO = new AventuraDAO(pg);

        return await DAO.read({
          id_aluno: req.auth.ID_aluno || null,
          id_professor: req.auth.ID_professor || null,
          id_aventura: req.params.id_aventura,
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  );
};

async function routesAlunos(fastify) {
  const pg = fastify.pg;

  fastify.addHook("onRequest", onRequest.somente_aluno);

  fastify.patch("/import", async (req, reply) => {
    try {
      let courses = [];
      let next_page = null;
      const now = new Date();
      const creation_time = 1000 * 60 * 60 * 24 * 30 * 5.5; // aproximadante 5.5 meses

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses?studentId=me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${req.auth.id_token}` },
        }
      );

      const body = await response.json();
      if (!response.ok)
        throw {
          status: 401,
          message: "Falha ao utilizar api Classromm",
          error: body.error,
        };

      courses = courses.concat(
        body.courses
          .filter((course) => course.courseState === "ACTIVE")
          .filter((course) => /^[A-z]{3}[0-9]{5}/.test(course.name))
          // .filter( course => /@id\.uff\.br$/.test( course.teacherGroupEmail ) )
          .filter(
            (course) => creation_time > now - new Date(course.creationTime)
          )
          .map((course) => ({
            TXT_nome: course.name.split("-")[1].trim(),
            TXT_numero_classe: course.name.split("-")[0].trim(),
            ID_google: parseInt(course.id),
            FL_evento: false,
          }))
      );

      const DAO = new AventuraDAO(pg);

      return await DAO.insertFromClassroom(req.auth.ID_aluno, courses);
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
}

async function routesProfessores(fastify) {
  const pg = fastify.pg;

  fastify.addHook("onRequest", onRequest.somente_professor);

  fastify.post("/", { schema: schemas.POST }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      req.body.FK_professor = req.auth.ID_professor;
      const id_aventura = await DAO.create(req.body);

      return { message: "Aventura criada com sucesso", id_aventura };
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.post("/import", async (req, reply) => {
    try {
      let next_page = null;
      const now = new Date();
      const creation_time = 1000 * 60 * 60 * 24 * 30 * 5.5; // aproximadante 5.5 meses

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses?teacherId=me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${req.auth.id_token}` },
        }
      );

      const body = await response.json();
      if (!response.ok)
        throw {
          status: 401,
          message: "Falha ao utilizar api Classromm",
          error: body.error,
        };

      const courses = body.courses
        .filter((course) => course.courseState === "ACTIVE")
        .filter((course) => /^[A-z]{3}[0-9]{5}/.test(course.name))
        // .filter( course => /@id\.uff\.br$/.test( course.teacherGroupEmail ) )
        .filter((course) => creation_time > now - new Date(course.creationTime))
        .map((course) => ({
          TXT_nome: course.name.split("-")[1].trim(),
          TXT_numero_classe: course.name.split("-")[0].trim(),
          ID_google: parseInt(course.id),
          FL_evento: false,
          FK_professor: req.auth.ID_professor,
        }));

      if (courses.length < 1)
        throw {
          status: 500,
          message: "Nenhuma aventura válida encontrada",
          error: body.error,
        };

      const DAO = new AventuraDAO(pg);

      const aventuras = await DAO.createFromClassroom(courses);

      await Promise.all(
        aventuras.map((a) =>
          updateAlunosFromClassroom(DAO, req.auth.id_token, a)
        )
      );

      return aventuras;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.patch(
    "/:id_aventura",
    { schema: schemas.PATCH },
    async (req, reply) => {
      try {
        const DAO = new AventuraDAO(pg);

        const id_aventura = await DAO.update(
          req.params.id_aventura,
          req.auth.ID_professor,
          req.body
        );

        return { message: "Aventura editada com sucesso", id_aventura };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  );

  fastify.patch(
    "/:id_aventura/alunos/:id_aluno",
    { schema: schemas.PATCH_ALUNO },
    async (req, reply) => {
      try {
        const DAO = new AventuraDAO(pg);

        const aventura_aluno = await DAO.insertAluno(
          req.params.id_aventura,
          req.auth.ID_professor,
          req.params.id_aluno
        );

        if (!aventura_aluno) {
          throw {
            status: 500,
            message: "Erro ao adicionar aluno na aventura",
          };
        }

        return { message: "Aluno adicionado a aventura" };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  );

  fastify.delete(
    "/:id_aventura",
    { schema: schemas.DELETE },
    async (req, reply) => {
      try {
        const DAO = new AventuraDAO(pg);

        const aventura = await DAO.delete(
          req.params.id_aventura,
          req.auth.ID_professor
        );

        return { message: "Aventura removida", aventura };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  );

  fastify.delete(
    "/:id_aventura/alunos/:id_aluno",
    { schema: schemas.DELETE_ALUNO },
    async (req, reply) => {
      try {
        const DAO = new AventuraDAO(pg);

        const aluno = await DAO.deleteAluno(
          req.params.id_aventura,
          req.auth.ID_professor,
          req.params.id_aluno
        );

        if (!aluno) {
          throw {
            status: 500,
            message: "Erro ao remover aluno da aventura",
          };
        }

        return { message: "Aluno removido da aventura" };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  );
}

async function updateAlunosFromClassroom(DAO, token, aventura) {
  const { ID_google, ID_aventura } = aventura;

  const response = await fetch(
    `https://classroom.googleapis.com/v1/courses/${ID_google}/students`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const body = await response.json();

  const alunos = body.students.map((x) => x.profile.id);

  return await DAO.updateFromClassroom(ID_aventura, alunos);
}
