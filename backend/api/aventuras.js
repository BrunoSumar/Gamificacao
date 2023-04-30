const { google } = require("googleapis");
const fetch = require('node-fetch');
const schemas = require("../schemas/aventuras");
const AventuraDAO = require("../DAO/AventuraDAO");
const { verify: VerifyToken } = require('../misc/someUsefulFuncsGoogleAuth')
const { user_type_code } = require("../misc/someUsefulFuncsUsers");

module.exports = async function routes(fastify) {
  const pg = fastify.pg;

  fastify.register( routesProfessores );

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

  fastify.get("/:id_aventura", { schema: schemas.GET_ID }, async (req, reply) => {
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
  });

  fastify.post("/import", async (req, reply) => {
    try {
      let courses = [];
      let next_page = null;
      const now = new Date();
      const creation_time = 1000*60*60*24*30*5.5 ; // aproximadante 5.5 meses

      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${ req.auth.id_token }` },
        }
      );

      const body = await response.json();
      if( !response.ok )
        throw body.error;

      courses = courses
        .concat(
          body.courses
            .filter( course => course.courseState === 'ACTIVE' )
            .filter( course => /^[A-z]{3}[0-9]{5}/.test( course.name ) )
            .filter( course => /@id\.uff\.br$/.test( course.teacherGroupEmail ) )
            .filter( course => creation_time > (now - new Date( course.creationTime )) )
            .map( course => ({
              TXT_nome: course.name.split('-')[1].trim(),
              TXT_numero_classe: course.name.split('-')[0].trim(),
              ID_google: parseInt( course.id ),
              FL_evento: false,
            }))
      );

      if( req.auth.ID_professor )
        courses = courses.map( c => ({ FK_professor: req.quth.professor, ...c }) );

      const DAO = new AventuraDAO( pg );

      return await DAO.createFromClassroom( req.auth.ID_aluno, courses );
    } catch (err) {
      console.error(err);
      throw err;
    }
  });
};

async function routesProfessores(fastify) {
  const pg = fastify.pg;

  fastify.addHook( "onRequest", async req => {
    if ( user_type_code['Professor'] !== req.auth.type || user_type_code['Admin'] !== req.auth.type ){
      throw {
        status: 403,
        message: "Operação restrita para professores",
      };
    }
  });

  fastify.post("/", { schema: schemas.POST }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      const id_aventura = await DAO.create( req.body );

      return { message: "Aventura criada com sucesso", id_aventura };
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.patch("/:id_aventura", { schema: schemas.PATCH }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      const id_aventura = await DAO.update( req.params.id_aventura, req.body );

      return { message: "Aventura editada com sucesso", id_aventura };
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.patch("/:id_aventura/alunos/:id_aluno", { schema: schemas.PATCH_ALUNO }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      const aventura_aluno = await DAO.insertAluno( req.params.id_aventura, req.params.id_aluno );

      if( !aventura_aluno ){
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
  });

  fastify.delete("/:id_aventura", { schema: schemas.DELETE }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      const aventura = await DAO.delete( req.params.id_aventura, req.auth.ID_professor );

      return { message: "Aventura removida", aventura };
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  fastify.delete("/:id_aventura/alunos/:id_aluno", { schema: schemas.DELETE_ALUNO }, async (req, reply) => {
    try {
      const DAO = new AventuraDAO(pg);

      const aluno = await DAO.deleteAluno( req.params.id_aventura, req.params.id_aluno );

      if( !aluno ){
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
  });
};
