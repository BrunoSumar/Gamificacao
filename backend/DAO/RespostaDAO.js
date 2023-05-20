const { isGrandeDesafio } = require("../misc/someUsefulFuncsDesafio");
const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const { isAventura } = require("../misc/someUsefulFuncsAventura");
const { isOpcaoDesafio, isMissaoAtiva, hasResposta } = require("../misc/someUsefulFuncsResposta");
const {
  hasGrupo,
  isDeletaGrupo,
  isMissaoEmGrupo,
  isGrupo,
  isAlunoGrupo,
} = require("../misc/someUsefulFuncsGrupos");
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

const conteudoDAO = require('./ConteudoDAO');

class RespostaDAO {
  constructor(db) {
    this._db = db;
  }

  async create(id_aventura, id_missao, id_desafio, id_aluno, resposta) {

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    if (!(await isMissaoAtiva(this._db, id_missao)))
      throw "prazo limite para entrega excedido";

    if ( await isGrandeDesafio(this._db, id_desafio) )
      throw "Desafio não aceita esse tipo de resposta";

    if ( await hasResposta(this._db, id_desafio, id_aluno) )
      throw "Desafio já respondido";

    if (!(await isOpcaoDesafio(this._db, resposta.FK_opcao, id_desafio)))
      throw "Opção não pertence ao desafio";

    resposta = {
      FK_aluno: id_aluno,
      FK_desafio: id_desafio,
      DT_resposta: new Date().toISOString(),
      ...resposta,
    };

    const text = `
      INSERT INTO "Respostas"
      ${ queryInsert( resposta ) }
      RETURNING *
    `;
    const values = queryValues( resposta );

    try {
      const { rows } = await this._db.query({ text, values });

      return {
        Message: "Desafio respondido",
        rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateConteudo(id_aventura, id_missao, id_desafio, id_aluno, conteudo, { id_grupo = null }) {
    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    if (!(await isMissaoAtiva(this._db, id_missao)))
      throw "prazo limite para entrega excedido";

    if (!(await isGrandeDesafio(this._db, id_desafio)))
      throw "Desafio não aceita esse tipo de resposta";

    if ( id_grupo && !(await isMissaoEmGrupo(this._db, id_missao)))
      throw "Missão não permite grupos";

    if ( id_grupo && !(await isGrupo(this._db, id_grupo)))
      throw "Grupo não existe";

    if( id_grupo && !(await hasGrupo(this._db, id_missao, id_aluno)) )
      throw 'Aluno não pertence a um grupo';

    if ( id_grupo && !(await isAlunoGrupo(this._db, id_aluno, id_grupo)))
      throw "Aluno não pertence ao grupo";

    let connection = {};
    let DAO = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const { rows: respostas_banco } = await connection.query( `
        DELETE FROM "Respostas"
        WHERE "FK_desafio" = ${ id_desafio }
        AND "FK_aluno" = ${ id_aluno }
        RETURNING *
      `);
      const antiga_resposta = respostas_banco[0] || null;

      if( antiga_resposta?.FK_conteudo ){
        const { rows: conteudos } = await connection.query(`
          SELECT * FROM "Conteudos" WHERE "ID_conteudo" = ${ antiga_resposta?.FK_conteudo }
        `);
        await new conteudoDAO( connection, 'fs', { path: conteudos[0].TXT_path_arquivo } ).delete();
      }

      const { ID_conteudo } = await new conteudoDAO( connection, 'fs', { file: conteudo } ).create();

      const resposta = {
        ...antiga_resposta,
        FK_aluno: id_aluno,
        FK_desafio: id_desafio,
        DT_resposta: new Date().toISOString(),
        FK_conteudo: ID_conteudo,
        FK_grupo: id_grupo,
      };

      const text = `
        INSERT INTO "Respostas"
        ${ queryInsert( resposta ) }
        RETURNING *
      `;
      const values = queryValues( resposta );
      const { rows } = await connection.query({ text, values });

      await connection.query("COMMIT");

      return {
        Message: antiga_resposta ? "Resposta atualizada" : "Desafio respondido",
        rows,
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      DAO.deleteFile();
      throw error;
    } finally {
      await connection.release();
    }
  }

  async delete(id_aventura, id_missao, id_desafio, id_aluno ) {
    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    if (!(await hasResposta(this._db, id_desafio, id_aluno)))
      throw "Desafio ainda não foi respondido";

    let connection = {};
    let DAO = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const { rows: grupos } = await connection.query( `
        SELECT *
        FROM "Grupos" LEFT JOIN "Grupos_Alunos" ON ("ID_grupo" = "FK_grupo")
        WHERE "FK_missao" = ${ id_missao }
        AND "FK_aluno" = ${ id_aluno }
      `);
      const id_grupo = grupos[0]?.FK_grupo || null;

      const { rows: respostas } = await connection.query( `
        DELETE FROM "Respostas"
        WHERE "FK_desafio" = ${ id_desafio }
        AND ${ id_grupo ? `"FK_grupo" = ${ id_grupo }` : `"FK_aluno" = ${ id_aluno }` }
        RETURNING *
      `);
      const id_conteudo = respostas[0]?.FK_conteudo || null;

      if( id_conteudo ){
        const { rows: conteudos } = await connection.query(`
          SELECT * FROM "Conteudos" WHERE "ID_conteudo" = ${ id_conteudo }
        `);
        await new conteudoDAO( connection, 'fs', { path: conteudos[0].TXT_path_arquivo } ).delete();
      }

      await connection.query("COMMIT");

      return {
        Message: "Resposta Removida",
        rows: respostas,
      };
    } catch (error) {
      console.error(error);
      await connection.query("ROLLBACK");
      DAO.deleteFile();
      throw error;
    } finally {
      await connection.release();
    }
  }

  async read(
    id_aventura,
    id_missao,
    id_desafio,
    { ID_aluno = null, ID_professor = null }
  ) {
    if (!ID_aluno && !ID_professor)
      throw "é necessario fornecer um ID de usuario";

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
      SELECT * FROM "Respostas"
      WHERE "FK_desafio" = ${ id_desafio }
      ${ ID_aluno ? `AND "FK_aluno" = ${ ID_aluno }` : '' }
    `;

    try {
      const { rows } = await this._db.query(query);

      return rows;
    } catch (error) {
      console.error(error);
      throw "Não foi possivel resgatar respostas";
    }
  }

  async update( id_aventura, id_missao, id_desafio, id_aluno, resposta ){
    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Missao não pertence a aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    if ( await isGrandeDesafio(this._db, id_desafio) )
      throw "Desafio não aceita esse tipo de resposta";

    if (!(await isMissaoAtiva(this._db, id_missao)))
      throw "prazo limite para entrega excedido";

    if (!(await hasResposta(this._db, id_desafio, id_aluno)))
      throw "Desafio ainda não foi respondido";

    if (!(await isOpcaoDesafio(this._db, resposta.FK_opcao, id_desafio)))
      throw "Opção não pertence ao desafio";

    try {
      const query = `
        UPDATE "Respostas"
        SET "FK_opcao" = ${ resposta.FK_opcao }
        WHERE "FK_desafio" = ${ id_desafio }
        AND "FK_aluno" = ${ id_aluno }
        RETURNING *
      `;
      const { rows } = await this._db.query( query );

      return {
        Message: "Resposta atualizada",
        rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

};

module.exports = RespostaDAO;
