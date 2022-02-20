class ProfessorDAO {
  constructor(db) {
    this._db = db;
  }

  async InsereProfessor(aluno) {
    const colunas = Object.keys(aluno).map((values) => `\"${values}\"`);
    const values = Object.values(aluno);

    const query = {
      text: `
          INSERT INTO "Professor" ( ${colunas.join(", ")})
          VALUES ( ${colunas.map((_, i) => "$" + (i + 1))} )
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
}

module.exports = ProfessorDAO;
