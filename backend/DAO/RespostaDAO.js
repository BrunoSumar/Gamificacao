const { isGrandeDesafio } = require("../misc/someUsefulFuncsDesafio");
const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const {
  isAventura,
  isAventuraAtiva,
} = require("../misc/someUsefulFuncsAventura");
const {
  isOpcaoDesafio,
  isMissaoAtiva,
  hasResposta,
} = require("../misc/someUsefulFuncsResposta");
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

const conteudoDAO = require("./ConteudoDAO");

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

    if (await isGrandeDesafio(this._db, id_desafio))
      throw "Desafio não aceita esse tipo de resposta";

    if (await hasResposta(this._db, id_desafio, id_aluno))
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
      ${queryInsert(resposta)}
      RETURNING *
    `;
    const values = queryValues(resposta);

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

  async updateConteudo(
    id_aventura,
    id_missao,
    id_desafio,
    id_aluno,
    conteudo,
    { id_grupo = null }
  ) {
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

    if (id_grupo && !(await isMissaoEmGrupo(this._db, id_missao)))
      throw "Missão não permite grupos";

    if (id_grupo && !(await isGrupo(this._db, id_grupo)))
      throw "Grupo não existe";

    if (id_grupo && !(await hasGrupo(this._db, id_missao, id_aluno)))
      throw "Aluno não pertence a um grupo";

    if (id_grupo && !(await isAlunoGrupo(this._db, id_aluno, id_grupo)))
      throw "Aluno não pertence ao grupo";

    let connection = {};
    let DAO = {};
    try {
      connection = await this._db.connect();

      await connection.query("BEGIN");

      const { rows: respostas_banco } = await connection.query(`
        DELETE FROM "Respostas"
        WHERE "FK_desafio" = ${id_desafio}
        AND "FK_aluno" = ${id_aluno}
        RETURNING *
      `);
      const antiga_resposta = respostas_banco[0] || null;

      if (antiga_resposta?.FK_conteudo) {
        const { rows: conteudos } = await connection.query(`
          SELECT * FROM "Conteudos" WHERE "ID_conteudo" = ${antiga_resposta?.FK_conteudo}
        `);
        await new conteudoDAO(connection, "fs", {
          path: conteudos[0].TXT_path_arquivo,
        }).delete();
      }

      const { ID_conteudo } = await new conteudoDAO(connection, "fs", {
        file: conteudo,
      }).create();

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
        ${queryInsert(resposta)}
        RETURNING *
      `;
      const values = queryValues(resposta);
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

  async delete(id_aventura, id_missao, id_desafio, id_aluno) {
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

      const { rows: grupos } = await connection.query(`
        SELECT *
        FROM "Grupos" LEFT JOIN "Grupos_Alunos" ON ("ID_grupo" = "FK_grupo")
        WHERE "FK_missao" = ${id_missao}
        AND "FK_aluno" = ${id_aluno}
      `);
      const id_grupo = grupos[0]?.FK_grupo || null;

      const { rows: respostas } = await connection.query(`
        DELETE FROM "Respostas"
        WHERE "FK_desafio" = ${id_desafio}
        AND ${
          id_grupo ? `"FK_grupo" = ${id_grupo}` : `"FK_aluno" = ${id_aluno}`
        }
        RETURNING *
      `);
      const id_conteudo = respostas[0]?.FK_conteudo || null;

      if (id_conteudo) {
        const { rows: conteudos } = await connection.query(`
          SELECT * FROM "Conteudos" WHERE "ID_conteudo" = ${id_conteudo}
        `);
        await new conteudoDAO(connection, "fs", {
          path: conteudos[0].TXT_path_arquivo,
        }).delete();
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

    if (ID_aluno && ID_professor) throw "Multiplos IDs de usuário fornecidos";

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (
      ID_professor &&
      !(await isProfessorAventura(this._db, ID_professor, id_aventura))
    )
      throw "Esse usuario não é professor dessa aventura";

    if (ID_aluno && !(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
      throw "Esse usuario não é aluno dessa aventura";

    const query = `
      SELECT * FROM "Respostas"
      WHERE "FK_desafio" = ${id_desafio}
      ${ID_aluno ? `AND "FK_aluno" = ${ID_aluno}` : ""}
    `;

    try {
      const { rows } = await this._db.query(query);

      return rows;
    } catch (error) {
      console.error(error);
      throw "Não foi possivel resgatar respostas";
    }
  }

  async update(id_aventura, id_missao, id_desafio, id_aluno, resposta) {
    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Missao não pertence a aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    if (await isGrandeDesafio(this._db, id_desafio))
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
        SET "FK_opcao" = ${resposta.FK_opcao}
        WHERE "FK_desafio" = ${id_desafio}
        AND "FK_aluno" = ${id_aluno}
        RETURNING *
      `;
      const { rows } = await this._db.query(query);

      return {
        Message: "Resposta atualizada",
        rows,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifica_resposta_aluno(
    lista_desafio,
    id_aluno,
    id_missao,
    id_aventura
  ) {
    let lista_error = {
      missaoAventura: [],
    };

    if (await isMissaoAtiva(this._db, id_missao))
      throw "prazo limite para entrega ainda não terminou";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Missao não pertence a aventura";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    lista_desafio.foreach(async (desafios_id) => {
      if (!(await hasResposta(this._db, id_desafio, id_aluno)))
        lista_error.missaoAventura.push(
          `O desafio ${desafios_id} não possui resposta`
        );
    });

    for (const property in lista_error) {
      if (lista_error[property].length > 0);
      throw lista_error;
    }

    const query = {
      text: `SELECT "Respostas"."FK_desafio", "Respostas"."FK_opcao" as "respota_enviada", "Opcoes"."ID_opcao" as "respota_correta", "Respostas"."NR_nota_grande_desafio" as "nota_grande_desafio" FROM "Respostas"
      LEFT JOIN "Opcoes"
      ON "Respostas"."FK_desafio" = "Opcoes"."FK_desafio"
      LEFT JOIN "Grupos"
      ON "Respostas"."FK_GRUPO" = "Grupos"."ID_grupo"
      LEFT JOIN "Grupos_Alunos"
      ON "Grupos_Alunos"."FK_grupo" = "Grupos"."ID_grupo"
      WHERE "Respostas"."FK_desafio" IN (${lista_desafio.map(
        (_, index) => `$${index + 1}`
      )}) and ("Opcoes"."FL_opcao_certa" = true or "Opcoes"."FL_opcao_certa" is null) and ("Respostas"."FK_aluno" = $${
        lista_desafio.length + 1
      } or "Grupos_Alunos"."FK_aluno" = $${lista_desafio.length + 1} )`,
      values: [...lista_desafio, id_aluno],
    };
    try {
      let { rows } = this._db.query(query);

      let notaFinal = 0;

      notaFinal =
        rows.reduce((acc, resposta) => {
          if (resposta.NR_nota_grande_desafio) {
            return acc + resposta.NR_nota_grande_desafio;
          } else {
            if ((resposta.respota_enviada = resposta.respota_correta))
              return acc + 100;
            else return acc + 0;
          }
        }) / rows.length;

      rows.notafinal = notaFinal;

      return {
        message: "Desafios Corrigidos",
        rows,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel corrigir os desafios";
    }
  }

  async verifica_resposta_aventura_aluno(id_aventura, id_aluno) {
    if (await isAventuraAtiva(this._db, id_aventura))
      throw "prazo limite para entrega ainda não terminou";

    if (!(await isAlunoAventura(this._db, id_aluno, id_aventura)))
      throw "Aluno não pertence à aventura";

    let query = {
      text: `SELECT "Missoes"."ID_missao", array_agg("Desafios"."ID_desafio") as lista_desafios,
       FROM "Missoes" 
       LEFT JOIN "Desafios" 
       ON "Desafios"."FK_missao" = "Missoes"."ID_missao"
       WHERE "Missoes"."FK_aventura = $1
       GROUP BY "Missoes"."ID_missao"
       `,
      values: [id_aventura],
    };

    try {
      let { rows } = this._db.query(query);
      let rows_final = rows.map(async (element) => {
        rows_final.push({
          id_missao: element.ID_missao,
          respostas: await this.verifica_resposta(
            element.lista_desafios,
            id_aluno,
            element.ID_missao,
            id_aventura
          ),
        });
      });

      let notaFinalAventura =
        rows_final.reduce((acc, resposta) => {
          return acc + resposta.notafinal;
        }) / rows_final.length;

      let resposta_final = {
        notaFinalAventura,
        rows_final,
      };

      return {
        message: "Nota da aventura calculada com sucesso!",
        resposta_final,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel corrigir os desafios";
    }
  }

  async verifica_resposta_todos_alunos_missao(
    id_missao,
    ID_professor,
    id_aventura
  ) {
    if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
      throw "Esse professor não faz mestra essa aventura";
    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte da aventura";

    let query = {
      text: `
        SELECT "Aventuras"."ID_aventura", "Alunos_Aventuras"."FK_aluno", "Missoes"."ID_missao", array_agg("Desafios"."ID_desafio") as lista_desafio 
        FROM "Aventuras"
        LEFT JOIN "Alunos_Aventuras"
        ON "Aventuras"."ID_aventura" = "Alunos_Aventuras"."FK_aventura"
        LEFT JOIN "Missoes"
        ON "Aventuras"."ID_aventura" = "Missoes"."FK_aventura"
        LEFT JOIN "Desafios"
        ON "Desafios"."FK_missao" = "Missoes"."ID_missao"
        WHERE "Missoes"."ID_missao" = $1 and "Aventuras"."ID_aventura" = $2
        GROUP BY "Aventuras"."ID_aventura", "Alunos_Aventuras"."FK_aluno", "Missoes"."ID_missao"
        `,
      values: [id_missao, id_aventura],
    };

    try {
      let { rows } = this._db.query(query);
      let rows_final = rows.map(async (element) => {
        return {
          id_aluno: element.FK_aluno,
          respostas: await this.verifica_resposta_aluno(
            element.lista_desafio,
            element.FK_aluno,
            id_missao,
            id_aventura
          ),
        };
      });
      return {
        message: "Respostas de todos os alunos nessa missão",
        rows: rows_final,
      };
    } catch (error) {
      console.log(error)
      throw 'Não foi possivel obter as informações'
    }
  }

  async verifica_resposta_todos_alunos_aventura(id_aventura, ID_professor) {
    if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
      throw "Esse professor não faz mestra essa aventura";
    let query = {
      text: 'Select * from "Alunos_Aventuras" WHERE FK_aventura = $1',
      values: [id_aventura],
    };
    try {
      let { rows } = this._db.query(query);
      let rows_final = rows.map(async (element) => {
        return {
          id_aluno: element.FK_aluno,
          respostas: await this.verifica_resposta_aventura_aluno(
            id_aventura,
            element.FK_aluno
          ),
        };
      });

      return {
        message: "nota de todos os alunos na aventura",
        rows: rows_final,
      };
    } catch (error) {
      console.log(error)
      throw 'Não foi possivel obter as informações'
    }
  }
}

module.exports = RespostaDAO;
