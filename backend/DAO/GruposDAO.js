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
  
  async read(
    id_aventura,
    id_missao,
    { ID_aluno = null, ID_professor = null }
  ) {}

  async update(id_aventura, id_missao, id_aluno) {}

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
}

module.exports = GruposDAO;
