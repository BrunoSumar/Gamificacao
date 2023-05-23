const { hasOpcoes, hasUniqueAnwser, isDesafioMissao, isGrandeDesafio } = require("../misc/someUsefulFuncsDesafio");
const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const { isAventura } = require("../misc/someUsefulFuncsAventura");
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class opcaoDAO {
  constructor(db) {
    this._db = db;
  };

  async create(id_aventura, id_missao, id_desafio, id_professor, opcoes) {

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

    if ( await isGrandeDesafio(this._db, id_desafio) )
      throw "Esse desafio não suporta opções";

    if ( await hasOpcoes(this._db, id_desafio) )
      throw "Esse desafio já tem opções cadastradas";

    if ( !opcoes || opcoes.length < 1 )
      throw "Opções inválidas";

    if ( !hasUniqueAnwser( opcoes ) )
      throw "O desafios deve uma e somente uma opção correta";

    opcoes = opcoes.map( opcao => ({
      FK_desafio: id_desafio,
      ...opcao,
    }));

    const text = `
      INSERT INTO "Opcoes"
      ${ queryInsert( opcoes ) }
      RETURNING *
    `;
    const values = queryValues( opcoes );

    try {
      const { rows } = await this._db.query({ text, values });

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async read(
    id_aventura,
    id_missao,
    id_desafio,
    { ID_aluno = null, ID_professor = null }
  ) {
    if (!ID_aluno && !ID_professor)
      throw "É necessario fornecer um ID de usuario";

    if (ID_aluno && ID_professor)
      throw "Multiplos IDs de usuário fornecidos";

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if ( ID_professor && !(await isProfessorAventura(this._db, ID_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

    if ( ID_aluno && !(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
      throw "Esse usuario não é aluno dessa aventura";

    const query = `
      SELECT * FROM "Opcoes"
      WHERE "FK_desafio" = ${ id_desafio }
    `;

    try {
      const { rows } = await this._db.query(query);
      if( ID_aluno )
        rows.forEach( r => delete r.FL_opcao_certa );
      return rows;
    } catch (error) {
      console.error(error);
      throw "Não foi possivel buscar as opções";
    }
  };

  async update( id_aventura, id_missao, id_desafio, id_professor, opcoes ){
    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Missao não pertence a aventura";

    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Professor não pertence a aventura";

    if ( await isGrandeDesafio(this._db, id_desafio) )
      throw "Esse desafio não suporta opções";

    if ( !opcoes || opcoes.length < 1 )
      throw "Opções inválidas";

    if ( !hasUniqueAnwser( opcoes ) )
      throw "O desafios deve uma e somente uma opção correta";

    const [ novas_opcoes, antigas_opcoes ] = opcoes.reduce( (acc,cur) => {
      acc[ cur.ID_opcao ? 1 : 0 ].push(cur);
      return acc;
    }, [[],[]] );

    let connection = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const text = `
        DELETE FROM "Opcoes"
        WHERE "FK_desafio" = $1
        RETURNING *
      `;
      const { rows: opcoes_banco } = await connection.query({
        values: [ id_desafio ],
        text,
      });
      const opcoes_banco_map = new Map();
      opcoes_banco.forEach( opcao => opcoes_banco_map.set( opcao.ID_opcao, opcao ) );

      if( antigas_opcoes.some( opcao => !opcoes_banco_map.has( opcao.ID_opcao ) ) )
        throw "Uma das opções não pertence ao desafio";

      if( antigas_opcoes.length > 0 ){
        const opcoes = antigas_opcoes.map( opcao => ({
          FK_desafio: id_desafio,
          ...opcoes_banco_map.get( opcao.ID_opcao ),
          ...opcao
        }));

        const text = `
          INSERT INTO "Opcoes"
          ${ queryInsert( opcoes ) }
        `;
        const values = queryValues( opcoes );
        await connection.query({ text, values });
      }

      if( novas_opcoes.length > 0 ){
        const opcoes = novas_opcoes.map( opcao => ({
          FK_desafio: id_desafio,
          ...opcao,
        }));

        const text = `
          INSERT INTO "Opcoes"
          ${ queryInsert( opcoes ) }
        `;
        const values = queryValues( opcoes );
        await connection.query({ text, values });
      }

      const finalQuery = `SELECT * FROM "Opcoes" WHERE "FK_desafio" = ${id_desafio} ORDER BY "ID_opcao"`;
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
  };
};


module.exports = opcaoDAO;
