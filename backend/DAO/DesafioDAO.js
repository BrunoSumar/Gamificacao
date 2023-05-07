const { hasDesafios, hasUniqueIndices } = require("../misc/someUsefulFuncsDesafio");
const { isAventura } = require("../misc/someUsefulFuncsAventura");
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class DesafioDAO {
  constructor(db) {
    this._db = db;
  }

  async create(id_aventura, id_missao, id_professor, payload) {
    const currentDate = new Date();

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

    const arrayQueries = payload.map((desafio) => {
      const keys = Object.keys(desafio);
      const values = Object.values(desafio);
      return {
        text: `INSERT INTO "Desafios" ("FK_missao","DT_desafio", ${keys.map(
          (value) => `"${value}"`
        )})
        VALUES ($1,$2,${keys.map((_, index) => `$${index + 3}`)})`,
        values: [id_missao, currentDate.toISOString(), ...values],
      };
    });

    let connection = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      arrayQueries.forEach(async (element) => {
        await connection.query(element);
      });

      await connection.query("COMMIT");

      const finalQuery = `SELECT * FROM "Desafios" WHERE "FK_missao" = ${id_missao} ORDER BY "NR_indice"`;
      const { rows } = await connection.query(finalQuery);
      return {
        Message: "Desafio(s) Criado(s)",
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

    if (!(await hasUniqueIndices(payload)))
      throw "Os indices dos desafios devem ser únicos";

    const query = `
      SELECT * FROM "Desafios"
      WHERE ${ ID_desafio ? '"ID_desafio"' : '"FK_missao"' } = ${ ID_desafio || id_missao }
      ORDER BY "NR_indice"
    `;

    try {
      const { rows } = await this._db.query(query);
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

    let connection = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const [ novos_desafios, antigos_desafios ] = desafios.reduce( (acc,cur) => {
        acc[ cur.ID_desafio ? 1 : 0 ].push(cur);
        return acc;
      }, [[],[]] );

      const remove_text = `
        DELETE FROM "Desafios"
        WHERE "FK_missao" = $1
        RETURNING *
      `;
      const remove_values = [ id_missao ];
      const { rows: desafios_banco } = await connection.query({
        text: remove_text,
        values: remove_values,
      });

      if( antigos_desafios.length > 0 ){
        const desafios_banco_map = new Map();
        desafios_banco.forEach( d => desafios_banco_map.set( d.ID_desafio, d ) );
        const desafios_update = antigos_desafios.map( d => ({...desafios_banco_map.get( d.ID_desafio ), ...d}) );

        let _i = 1;
        const update_values = desafios_update
              .map( desafio => Object.values(desafio) )
              .reduce( (acc,cur) => acc.concat(cur) );
        const update_colunas = Object
              .keys( desafios_update[0] )
              .map( chave => `"${ chave.trim() }"` );
        const update_values_query = desafios_update
              .map( _ => update_colunas.map( _ => `$${_i++}` ) )
              .map( val => `(${ val })` );
        const update_text = `
          INSERT INTO "Desafios" (${ update_colunas })
          VALUES ${ update_values_query }
          RETURNING *
        `;
        const { rows } = await connection.query({
          text: update_text,
          values: update_values,
        });
      }

      if( novos_desafios.length > 0 ){
        const current_date = new Date().toISOString();
        const desafios_create = novos_desafios.map( d => ({
          FK_missao: id_missao,
          NR_indice: d.NR_indice,
          TXT_titulo: d.TXT_titulo,
          TXT_descricao: d.TXT_descricao,
          FL_grande_desafio: d.FL_grande_desafio,
          DT_desafio: current_date,
        }));

        let _i = 1;
        const create_values = desafios_create
              .map( desafio => Object.values(desafio) )
              .reduce( (acc,cur) => acc.concat( cur ) );
        const create_colunas = Object
              .keys( desafios_create[0] )
              .map( chave => `"${ chave.trim() }"` );
        const create_values_query = desafios_create
              .map( _ => create_colunas.map( _ => `$${_i++}` ) )
              .map( val => `(${ val })` );
        const create_text = `
          INSERT INTO "Desafios" (${ create_colunas })
          VALUES ${ create_values_query }
          RETURNING *
        `;
        const { rows } = await connection.query({
          text: create_text,
          values: create_values,
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
}


module.exports = DesafioDAO;
