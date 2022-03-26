const schemas = require("../schemas/aventuras");
const AventuraDAO = require("../DAO/AventuraDAO");
const { google } = require("googleapis");
const { verify: VerifyToken } = require('../misc/someUsefulFuncsGoogleAuth')

module.exports = async function privateRoutes(fastify) {
  const pg = fastify.pg;

  const oauth = fastify.oauth;

  fastify.get("/", { schema: schemas.GET }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      return await DAO.busca(
        req.auth.tipo === 1,
        req.auth.ID_aluno || req.auth.ID_professor
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.get("/:id", { schema: schemas.GET_ID }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      return await DAO.busca(
        req.auth.tipo === 1,
        req.auth.ID_aluno || req.auth.ID_professor,
        req.params.id
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.get("/import", async (req, reply) => {
    try {
      const auth = req.auth.accessToken;
      console.log(req.auth, "\n\n");
      if(await VerifyToken(req.auth.tokenId)){
        const token = await oauth.getToken(  );
        listCourses(token);
      }
      return null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  async function listCourses(auth) {
    const classroom = await google.classroom();
    classroom.courses.list(
      {
        pageSize: 10,
      },
      (err, res) => {
        if (err) return console.error("The API returned an error: " + err);
        const courses = res.data.courses;
        if (courses && courses.length) {
          console.log("Courses:");
          courses.forEach((course) => {
            console.log(`${course.name} (${course.id})`);
          });
        } else {
          console.log("No courses found.");
        }
      }
    );
  }

  fastify.post("/", { schema: schemas.POST }, async (req, reply) => {
    // TODO: verificar se professor existe antes de criar aventura
    if (req.auth.tipo !== 0)
      throw {
        status: 403,
        message: "Apenas professores podem criar aventuras",
      };

    try {
      const DAO = new AventuraDAO(pg);

      req.body.FK_Professor = req.auth.id;

      await DAO.adiciona(req.body);

      return { status: 200, message: "Aventura criada com sucesso" };
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
};
