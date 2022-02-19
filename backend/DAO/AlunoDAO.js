class AlunoDAO {
  constructor(db) {
    this._db = db;
  }

  async buscaAluno() {
    // resp = conn.query("select * from aluno");
    const resp = this._db.query("select 1 as num");
    if (resp)
      return resp;
    else
      throw "Aluno não encontrado";
  }
}

module.exports = AlunoDAO;
