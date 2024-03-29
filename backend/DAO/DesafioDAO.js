const { hasDesafios, hasUniqueIndices } = require("../misc/someUsefulFuncsDesafio");
const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const { isAventura } = require("../misc/someUsefulFuncsAventura");
const { isMissaoEmGrupo } = require("../misc/someUsefulFuncsGrupos");
const corretTimezone = require('../misc/someUsefulFuncsHora')
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

const conteudoDAO = require("./ConteudoDAO");

class DesafioDAO {
  constructor(db) {
    this._db = db;
  }

  async create(id_aventura, id_missao, id_professor, payload) {

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

    if ( await hasDesafios(this._db, id_missao) )
      throw "Essa missão já tem desafios cadastrados";

    if (!(await hasUniqueIndices(payload)))
      throw "Os indices dos desafios devem ser únicos";

    if( payload.some( x => !x.FL_grande_desafio ) && (await isMissaoEmGrupo( this._db, id_missao )) )
      throw "Missões em grupo aceitam apenas pequenos desafios";

    const current_date =  corretTimezone(new Date()).toISOString();
    console.log(current_date)
    const desafios = payload.map( desafio => ({
      DT_desafio: current_date,
      FK_missao: id_missao,
      ...desafio
    }));

    const text = `
      INSERT INTO "Desafios"
      ${ queryInsert( desafios ) }
      RETURNING *
    `;
    const values = queryValues( desafios );

    try {
      const { rows } = await this._db.query({ text, values });

      return {
        Message: "Desafio(s) Criado(s)",
        rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async read(
    id_aventura,
    id_missao,
    { ID_aluno = null, ID_professor = null, ID_desafio = null }
  ) {
    if (!ID_aluno && !ID_professor)
      throw "é necessario fornecer um ID de usuario";

    if (ID_aluno && ID_professor)
      throw "é necessario fornecer apenas um unico id de usuario";

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if ( ID_professor && !(await isProfessorAventura(this._db, ID_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

    if ( ID_aluno && !(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
      throw "Esse usuario não é aluno dessa aventura";

    const query = `
      SELECT "Desafios".* ${ ID_desafio ? ', jsonb_agg("Opcoes".*) AS opcoes' : '' }
      FROM "Desafios" ${ ID_desafio ? 'LEFT JOIN "Opcoes" ON ("ID_desafio" = "FK_desafio")' : '' }
      WHERE ${ ID_desafio ? '"ID_desafio"' : '"FK_missao"' } = ${ ID_desafio || id_missao }
      ${ ID_desafio ? 'GROUP BY "ID_desafio"' : '' }
      ORDER BY "NR_indice"
    `;

    try {
      const { rows } = await this._db.query(query);
      if( ID_aluno )
        rows.forEach( r => r.opcoes?.forEach( o => delete o.FL_opcao_certa ) );

      return {
        message: "Desafio(s) recuperado(s) com sucesso",
        rows,
      };
    } catch (error) {
      console.error(error);
      throw "Não foi possivel regatar desafios";
    }
  }

  async update( id_aventura, id_missao, id_professor, desafios ){
    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Missao não pertence a aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Professor não pertence a aventura";

    if (!(await hasUniqueIndices(desafios)))
      throw "Os indices dos desafios devem ser únicos";

    const [ novos_desafios, antigos_desafios ] = desafios.reduce( (acc,cur) => {
      acc[ cur.ID_desafio ? 1 : 0 ].push(cur);
      return acc;
    }, [[],[]] );

    let connection = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const text = `
        DELETE FROM "Desafios"
        WHERE "FK_missao" = $1
        RETURNING *
      `;
      const { rows: desafios_banco } = await connection.query({
        values: [ id_missao ],
        text,
      });

      if( antigos_desafios.length > 0 ){
        const desafios_banco_map = new Map();
        desafios_banco.forEach( d => desafios_banco_map.set( d.ID_desafio, d ) );
        const desafios_update = antigos_desafios.map( d => ({...desafios_banco_map.get( d.ID_desafio ), ...d}) );

        const text = `
          INSERT INTO "Desafios"
          ${ queryInsert( desafios_update ) }
        `;
        await connection.query({
          values: queryValues( desafios_update ),
          text,
        });
      }

      if( novos_desafios.length > 0 ){
        const current_date =  corretTimezone(new Date()).toISOString();
        const desafios_create = novos_desafios.map( desafio => ({
          FK_missao: id_missao,
          DT_desafio: current_date,
          ...desafio,
        }));

        const text = `
          INSERT INTO "Desafios"
          ${ queryInsert( desafios_create ) }
        `;
        await connection.query({
          values: queryValues( desafios_create ),
          text,
        });
      }

      const finalQuery = `SELECT * FROM "Desafios" WHERE "FK_missao" = ${id_missao} ORDER BY "NR_indice"`;
      const { rows } = await connection.query(finalQuery);

      await connection.query("COMMIT");
      return {
        Message: "Desafios Atualizados",
        rows,
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      await connection.release();
    }
  }

  async updateConteudo( id_aventura, id_missao, id_desafio, id_professor, conteudo ) {
    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Professor não pertence à aventura";

    let connection = {};
    let DAO = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const { rows: desafios } =  await connection.query(`
        SELECT * FROM "Desafios" WHERE "ID_desafio" = ${ id_desafio }
      `);

      if( desafios[0]?.FK_conteudo ){
        await connection.query(`
          UPDATE  "Desafios" SET "FK_conteudo" = NULL
          WHERE "ID_desafio" = ${ id_desafio }
        `);
        const { rows: conteudos } = await connection.query(`
          SELECT * FROM "Conteudos"
          WHERE "ID_conteudo" = ${ desafios[0]?.FK_conteudo }
        `);
        DAO = new conteudoDAO(connection, "fs", {
          path: conteudos[0].TXT_path_arquivo,
        });
        await DAO.delete();
      }

      DAO = new conteudoDAO(connection, "fs", { file: conteudo });
      const { ID_conteudo } = await DAO.create();

      const { rows } = await connection.query(`
        UPDATE "Desafios" SET "FK_conteudo" = ${ ID_conteudo }
        WHERE "ID_desafio" = ${ id_desafio }
        RETURNING *
     `);

      await connection.query("COMMIT");

      return {
        Message: "Conteúdo de desafio salvo",
        rows,
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      DAO.deleteFile && DAO.deleteFile();
      throw error;
    } finally {
      await connection.release();
    }
  }

  async deleteConteudo( id_aventura, id_missao, id_desafio, id_professor ) {
    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Professor não pertence à aventura";

    let connection = {};
    let DAO = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const { rows: conteudos } = await connection.query(`
        SELECT * FROM "Conteudos"
        WHERE "ID_conteudo" IN (
          SELECT "FK_conteudo" FROM "Desafios"
          WHERE "ID_desafio" = ${ id_desafio }
        )
      `);
      if( conteudos.length < 1 )
        throw "Conteúdo do desafio naõ encontrado";

      await connection.query(`
        UPDATE "Desafios" SET "FK_conteudo" = NULL
        WHERE "ID_desafio" = ${ id_desafio }
     `);

      DAO = new conteudoDAO(connection, "fs", {
        path: conteudos[0].TXT_path_arquivo,
      });
      await DAO.delete();

      await connection.query("COMMIT");

      return {
        Message: "Conteúdo de desafio removido",
        rows: conteudos[0],
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      DAO.deleteFile && DAO.deleteFile();
      throw error;
    } finally {
      await connection.release();
    }
  }
}


module.exports = DesafioDAO;
