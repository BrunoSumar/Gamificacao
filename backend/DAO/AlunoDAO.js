class AlunoDAO {
  constructor(db) {
    this._db = db;
  }

  async InsereAluno(aluno) {
    const colunas = Object.keys(aluno).map((values) => `\"${values}\"`);
    const values = Object.values(aluno);

    const query = {
      text: `
        INSERT INTO "Aluno" ( ${colunas.join(", ")})
        VALUES ( ${colunas.map((_, i) => "$" + (i + 1))} )
        RETURNING *
    `,
      values: values,
    };
    try {
      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno inserido no banco",
        rows: rows[0],
        err: false,
      };
    } catch (e) {
      throw {
        msg: "Erro ao inserir aluno no banco",
        rows: null,
        err: e,
      };
    }
  }
}

module.exports = AlunoDAO;
