const {
  hasGrupo,
  isDeletaGrupo,
  isMissaoEmGrupo,
} = require("../misc/someUsefulFuncsGrupos");
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class GruposDAO {
  constructor(db) {
    this._db = db;
  }

  async create(id_aventura, id_missao, ID_aluno) {
    if( !(await isMissaoAventura(this._db, id_missao, id_aventura)) )
      throw 'Missao não pertence a aventura';

    if( !(await isMissaoEmGrupo(this._db, id_missao)) )
      throw 'Missão não permite grupos';

    if( !(await isAlunoAventura(this._db, ID_aluno, id_aventura)) )
      throw 'Aluno não pertence a aventura';

    if( await hasGrupo(this._db, id_missao, ID_aluno) )
      throw 'Aluno já pertence a um grupo';

    let connection = {};
    try{
      connection = await this._db.connect();

      await connection.query('BEGIN');

      const currentDate = new Date();
      const query_create = `
        INSERT INTO "Grupos" ("FK_missao","DT_criacao")
        VALUES (${id_missao}, '${currentDate.toISOString()}')
        RETURNING "ID_grupo"
      `;
      const { rows: grupos } = await connection.query(query_create);
      if( grupos.length < 1 )
        throw 'Erro ao inserir grupo no banco';

      const query_insert = `
        INSERT INTO "Grupos_Alunos" ("FK_grupo","FK_aluno")
        VALUES (${ grupos[0].ID_grupo }, ${ ID_aluno } )
        RETURNING *
      `;
      const { rows: grupos_alunos } = await connection.query(query_insert);
      if( grupos_alunos.length < 1 )
        throw 'Erro ao inserir aluno ao grupo no banco';;

      await connection.query('COMMIT');
      return {
        Message: "Grupo Criado",
        row: grupos[0],
      };
    }
    catch( error ){
      console.error( error );
      await connection.query('ROLLBACK');
      throw error;
    }

    finally{
      await connection.release();
    }
  }
  async delete(id_aventura, id_missao, ID_aluno) {
    if( !(await isMissaoAventura(this._db, id_missao, id_aventura)) )
      throw 'Missao não pertence a aventura';

    if( !(await isMissaoEmGrupo(this._db, id_missao)) )
      throw 'Missão não permite grupos';

    if( !(await isAlunoAventura(this._db, ID_aluno, id_aventura)) )
      throw 'Aluno não pertence a aventura';

    if( !(await hasGrupo(this._db, id_missao, ID_aluno)) )
      throw 'Aluno não pertence a um grupo';

    let connection = {};
    try{
      connection = await this._db.connect();
      await connection.query('BEGIN');

      const query_alunos = `
        DELETE FROM "Grupos_Alunos"
        WHERE "FK_aluno" = id_aluno
        AND "FK_grupo" IN ( SELECT FROM "Grupo" WHERE "FK_missao" = ${ id_missao } )
        RETURNING *
      `;
      const { rows: grupos } = await connection.query(query_alunos);
      if( grupos.length < 1 )
        throw 'Erro ao inserir aluno ao grupo no banco';;

      console.log( grupos )

      // const currentDate = new Date();
      // const query_create = `
      //   INSERT INTO "Grupos" ("FK_missao","DT_criacao")
      //   VALUES (${id_missao}, '${currentDate.toISOString()}')
      //   RETURNING "ID_grupo"
      // `;
      // const { rows: grupos } = await connection.query(query_create);
      // if( grupos.length < 1 )
      //   throw 'Erro ao inserir grupo no banco';

      // await connection.query('COMMIT');
      await connection.query('ROLLBACK');
      return {
        Message: "Grupo Criado",
        row: grupos[0],
      };
    }
    catch( error ){
      console.error( error );
      await connection.query('ROLLBACK');
      throw error;
    }

    finally{
      await connection.release();
    }
  }

  async read(id_aventura, id_missao, { ID_aluno = null, ID_professor = null }) {
    if (ID_aluno) {
      if (!(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
        throw { status: 403, message: "Aluno não pertence a aventura" };

      const query = {
        text: `WITH temp_table AS (
        SELECT * FROM "Missoes" AS m
        JOIN "Grupos" AS g
        ON m."ID_missao" = g."FK_missao"
        JOIN "Grupos_Alunos" AS ga 
        ON ga."FK_grupo" = g."ID_grupo"
        WHERE m."ID_missao" = $1 and ga."FK_aluno" = $2)
        SELECT tt."ID_missao", a."ID_aluno",ga."FK_grupo", a."TXT_primeiro_nome", a."TXT_ultimo_nome" 
        FROM temp_table AS tt
        JOIN "Grupos_Alunos" AS ga 
        ON ga."FK_grupo" = tt."ID_grupo"
        JOIN "Alunos" AS a
        ON ga."FK_aluno" = a."ID_aluno"`,
        values: [id_missao, ID_aluno],
      };
      const { rows } = await this._db.query(query);
      return {
        message: "Alunos que pertencem ao seu grupo",
        rows,
      };
    }

    if (ID_professor) {
      if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
        throw { status: 403, message: "Professor não pertence a aventura" };
      const query = {
        text: `SELECT g."ID_grupo", g."FK_missao", a."ID_aluno",a."TXT_primeiro_nome", a."TXT_ultimo_nome", g."DT_criacao" 
              FROM "Grupos" as g
              JOIN "Grupos_Alunos" AS ga
              on g."ID_grupo" = ga."FK_grupo"
              JOIN "Alunos" AS a
              ON ga."FK_aluno" = a."ID_aluno"
              WHERE "FK_missao" = $1`,
        values: [id_missao],
      };
      const { rows } = await this._db.query(query);
      return {
        message: "Todos os alunos cadastrados em um grupo",
        rows,
      };
    }
    throw "Esse não é um usuario valido!";
  }
  async update(id_aventura, id_missao, ID_aluno) {}
}

module.exports = GruposDAO;
