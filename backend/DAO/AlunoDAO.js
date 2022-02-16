const conn = require("./db/banco");
class Aluno {
  async buscaAluno(...rest) {
    return new Promise((resolve, reject) => {
      resp = conn.sql("select * from aluno", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
