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

  async create(id_aventura, id_missao, id_professor, payload) {
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

      const finalQuery = `SELECT * FROM "Desafios" WHERE FK_missao = ${id_missao}`;
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

  async read(id_aventura, id_missao, { ID_aluno = null, ID_professor = null }) {
    if (!ID_aluno && !ID_professor)
      throw "é necessario fornecer um ID de usuario";

    if (ID_aluno && ID_professor)
      throw "é necessario fornecer apenas um unico id de usuario";

    if (!(await isAventura(this._db, id_aventura)))
      throw "Essa não é uma aventura valida";

    if (!(await isMissaoAventura(this._db, id_missao, id_aventura)))
      throw "Essa missão não faz parte dessa aventura";

    if (ID_professor)
      if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
        throw "Esse usuario não é professor dessa aventura";

    if (ID_aluno)
      if (!(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
        throw "Esse usuario não é aluno dessa aventura";

    const query = `SELECT * FROM "Desafios" WHERE FK_missao = ${id_missao}`;
    const { rows } = this._db.query(query);
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

    if (ID_professor)
      if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
        throw "Esse usuario não é professor dessa aventura";

    if (ID_aluno)
      if (!(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
        throw "Esse usuario não é aluno dessa aventura";
    let query = "";

    if (ID_desafio) {
      query = `SELECT * FROM "Desafios" WHERE FK_missao = ${id_missao}`;
    } else {
      query = `SELECT * FROM "Desafios" WHERE ID_desafio = ${ID_desafio}`;
    }
    try {
      const { rows } = this._db.query(query);
      return {
        message: "Desafio(s) recuperado(s) com sucesso",
        rows,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel regatar missoes";
    }
  }

  async delete(id_desafio) {}
}

module.exports = DesafioDAO;
