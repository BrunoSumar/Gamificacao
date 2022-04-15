const { google } = require("googleapis");
const fetch = require('node-fetch');
const schemas = require("../schemas/aventuras");
const AventuraDAO = require("../DAO/AventuraDAO");
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
      let courses = [];
      let next_page = null;
      const now = new Date();
      const creation_time = 1000*60*60*24*30*5 ; // aproximadante 1296*10^9 milisegundos ou 5 meses

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=0${ next_page ? '&pageToken=' + next_page : '' }`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${ req.auth.access_token }` },
        }
      );

      const body = await response.json();
      if( !response.ok )
        throw body.error;

      courses = courses
        .concat(
          body.courses
            .filter( course => /^[A-z]{3}[0-9]{5}/.test( course.name ) )
            .filter( course => /@id\.uff\.br$/.test( course.teacherGroupEmail ) )
            .filter( course => course.courseState === 'ACTIVE' )
            .filter( course => creation_time > (now - new Date( course.creationTime )) )
            .map( course => ({
              name: course.name.split('-')[1].trim(),
              class_number: course.name.split('-')[0].trim(),
              ID_google: parseInt( course.id ),
              is_event: false,
            }))
      );

      const DAO = new AventuraDAO( pg );
      return await DAO.adiciona( courses );
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
