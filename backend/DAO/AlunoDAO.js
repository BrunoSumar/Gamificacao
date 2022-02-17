class AlunoDAO {
  constructor(conn) {
    this._conn = conn;
  }

  async buscaAluno() {
    // resp = conn.query("select * from aluno");
    const resp = this._conn.query("select 1 as num");
    if (resp)
      return resp;
    else
      throw "Aluno não encontrado";
  }
}

new AlunoDAO;

module.exports = AlunoDAO;
