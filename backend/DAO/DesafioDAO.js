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

  async delete(id_desafio) {

  }
}

module.exports = DesafioDAO;
