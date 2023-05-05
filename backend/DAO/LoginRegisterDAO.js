const jwt_decode = require("jwt-decode");

class LoginRegisterDAO {
  constructor(db) {
    this._db = db;
  }

  async insere(usuario) {
    const values = this.__query_professor_aluno(usuario);

    const query = {
      text: `
          INSERT INTO "Login" ("FK_aluno", "FK_professor", "DT_criacao")
          VALUES ($1, $2, $3)
          RETURNING *
      `,
      values,
    };
    try {
      await this._db.query(query);
      return {
        msg: "Login registrado com sucesso",
      };
    } catch (error) {
      console.log(error)
      throw {
        msg: "Erro ao registrar login",
      };
    }
  }

  __query_professor_aluno(usuario) {
    const decoded = jwt_decode(usuario);
    const currentDate = new Date();
    switch (decoded.type) {
      case 1:
        return [decoded.ID_aluno, null, currentDate.toISOString()];
      case 2:
        return [null, decoded.ID_professor, currentDate.toISOString()];
      default:
        throw "Não é um usuario valido";
    }
  }
}

module.exports = LoginRegisterDAO;
