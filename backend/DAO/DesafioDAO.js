const {} = require("../misc/someUsefulFuncsDesafio");
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

  async create(payload, id_missao, id_aventura, id_professor) {
    const currentDate = new Date();
    
    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

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
      return {
        Message: "Grupo Criado",
        row: grupos[0],
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      await connection.release();
    }
  }

  async read(id_missao) {

  }

  async update( id_aventura, id_missao, id_desafio, id_professor, desafios ){
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

      const desafios_ids = antigos_desafios.map( d => d.ID_desafios );
      const remove_text = `
        DELETE FROM "Desafios"
        WHERE "FK_missao" = $1
        RETURNING *
      `;
      const remove_values = [ id_missao, desafios_id ];
      const { rows: desafios_banco } = await connection.query({
        text: remove_text,
        values: remove_values,
      });

      if( antigos_desafios.length > 0 ){
        const desafios_banco_map = new Map();
        desafios_banco.forEach( d => desafios_banco_map.set( d.ID_desafio, d ) );
        const desafios_update = antigos_desafios.map( d => ({...desafios_banco_map.get( d.ID_desafio ), ...d}) );

        let _i = 1;
        const update_values = aventuras
              .map( aventura => Object.values(aventura) )
              .reduce( (acc, aventura) => acc.concat( aventura ) );
        const update_colunas = Object
              .keys( desafios_update[0] )
              .map( chave => `"${ chave.trim() }"` );
        const update_values_query = desafios_update
              .map( _ => update_colunas.map( _ => `$${_i++}` ) )
              .map( val => `(${ val })` );
        const update_text = `
          INSERT INTO "Desafios" ${ update_colunas }
          VALUES ${ update_values_query }
        `;
        await connection.query({
          text: update_text,
          values: update_values,
        });
      }

      if( novos_desafios.length > 0 ){
        const current_date = new Date().toISOString();
        const desafios_create = novos_desafios.map( d => ({
          FK_missao: d.FK_missao,
          NR_indice: d.NR_indice,
          TXT_titulo: d.TXT_titulo,
          TXT_descricao: d.TXT_descricao,
          FL_grande_desafio: d.FL_grande_desafio,
          DT_criacao: current_date,
        })).map( d => Object.values(d).toString() );

        let _i = 1;
        const create_values = aventuras
              .map( aventura => Object.values(aventura) )
              .reduce( (acc, aventura) => acc.concat( aventura ) );
        const create_colunas = Object
              .keys( desafios_update[0] )
              .map( chave => `"${ chave.trim() }"` );
        const create_values_query = desafios_update
              .map( _ => update_colunas.map( _ => `$${_i++}` ) )
              .map( val => `(${ val })` );
        const create_text = `
          INSERT INTO "Desafios" ${ create_colunas }
          VALUES ${ create_values_query }
        `;
        await connection.query({
          text: create_text,
          values: create_values,
        });
      }

      await connection.query("COMMIT");
      return {
        Message: "Desafios Atualizados",
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
