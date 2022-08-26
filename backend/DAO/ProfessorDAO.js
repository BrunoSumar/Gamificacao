class ProfessorDAO {
  constructor(db) {
    this._db = db;
  }

  async insere(professor) {
    const values = Object.values(professor);

    const query = {
      text: `
          INSERT INTO "Professor" ("ID_google","TXT_num_professor","TXT_ultimo_nome","FL_validado")
          VALUES ($1, $2, $3, $4)
          RETURNING *
      `,
      values: values,
    };

    try {
      let { rows } = await this._db.query(query);
      return {
        msg: "Professor inserido no banco",
        rows: rows[0],
        err: false,
      };
    } catch (e) {
      throw {
        msg: "Erro ao inserir professor no banco",
        rows: null,
        err: e,
      };
    }
  }

  async busca(googleId) {
    try {
      const query = {
        text: `SELECT * from "Professores" where "ID_google" = $1`,
        values: [googleId],
      };
      let { rows } = await this._db.query(query);

      if (!rows || rows.length < 1) return null;

      return {
        msg: "Professor encontrado",
        row: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProfessorDAO;
