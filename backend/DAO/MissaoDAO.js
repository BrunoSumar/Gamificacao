const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const conteudoDAO = require("./ConteudoDAO");

class MissaoDAO {
  constructor(db) {
    this._db = db;
  }

  //Somente professor
  async create(payload, id_aventura, id_professor) {
    if (isProfessorAventura(this._db, id_professor, id_aventura)) {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `
            INSERT INTO "Missoes" ("FK_aventura",${keys.map((value) => `"${value}"`)})
            VALUES ($1, $2, $3, $4, $5)
        `,
        values: [id_aventura, ...values],
      };
      let { rows } = await this._db.query(query);
      return {
        message: "A Missão foi criada no banco",
        rows,
      };
    } else {
      throw {
        message: "Esse professor não é mestre dessa aventura",
      };
    }
  }

  async read(id_aventura, { id_aluno = null, id_professor = null }) {
    if (
      isProfessorAventura(this._db, id_professor, id_aventura) ||
      isAlunoAventura(this._db, id_aluno, id_aventura)
    ) {
      const query = `select * from "Missoes" where "FK_aventura" = ${id_aventura}`;
      let { rows } = await this._db.query(query);
      return {
        message: "Missões recuperadas com sucesso",
        rows,
      };
    } else {
      throw { message: "Esse Usuario não participa dessa aventura" };
    }
  }

  //somente professor
  async update(payload, id_aventura, id_professor, id_missao) {
    if (isProfessorAventura(this._db, id_professor, id_aventura)) {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `
                UPDATE "Missoes" SET ${keys.map(
                  (value, index) => `"${value}"=$${index + 1}`
                )}
                WHERE "ID_missao" = $${values.length + 1}
                RETURNING *
            `,
        values: [...values, id_missao],
      };
      let { rows } = await this._db.query(query);
      return {
        message: "A Missão foi alterada no banco",
        rows,
      };
    } else {
      throw {
        message: "Esse professor não é mestre dessa aventura",
      };
    }
  }

  //somente professor
  async delete(id_missao, id_professor, id_aventura) {
    if (isProfessorAventura(this._db, id_professor, id_aventura)) {
      const query = {
        text: `
            DELETE FROM "Missoes" WHERE "ID_missao" = ${id_missao}
        `,
      };
      await this._db.query(query);
      return {
        msg: "Missao deletada do banco",
      };
    }
  }

  async updateConteudo(
    id_aventura,
    id_missao,
    id_professor,
    conteudo
  ) {
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

      DAO = new conteudoDAO(connection, "fs", { file: conteudo });
      const { ID_conteudo } = await DAO.create();

      const { rows } = await connection.query(`
        UPDATE "Missoes" SET "FK_conteudo" = ${ id_conteudo }
        WHERE "ID_missao" = ${ id_missao }
        RETURNING *
     `);

      await connection.query("COMMIT");

      return {
        Message: "Conteúdo de missão",
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
}

module.exports = MissaoDAO;
