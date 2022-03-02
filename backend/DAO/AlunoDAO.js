class AlunoDAO {
  constructor(db) {
    this._db = db;
  }

  async insereAluno(aluno) {
    try {
      const values = Object.values(aluno);
      const query = {
        text: `
          INSERT INTO "Alunos" ("ID_google", first_name, last_name, coins)
          VALUES ($1 $2 $3 $4)
          RETURNING *
      `,
        values,
      };
      console.log(query);
      let { rows } = await this._db.query(query);
      console.log(rows);
      return {
        msg: "Aluno inserido no banco",
        row: rows,
        err: false,
      };
    } catch (e) {
      console.log(e)
      throw {
        msg: "Erro ao inserir aluno no banco",
        rows: null,
        err: e,
      };
    }
  }

  async buscaAluno(googleId) {
    try {
      const query = {
        text: `SELECT * from "Alunos" where "ID_google" = $1`,
        values: [googleId],
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno encontrado",
        row: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AlunoDAO;
