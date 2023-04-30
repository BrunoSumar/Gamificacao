const {

} = require('../misc/someUsefulFuncsDesafio')
class DesafioDAO {
  constructor(db) {
    this._db = db;
  }
  async create(payload, id_missao, id_professor) {

    if (await __verificaMissaoProfessor(id_missao, id_professor)) {
      const values = Object.values(payload);
      const keys = Object.keys(payload);

      const query = {
        text: `
                          INSERT INTO "Desafios" (${keys.map((value) => `"${value}"`)},"FK_missao") 
                          VALUES(${keys.map((value, idx) => `$${idx + 1}`)},$${keys.length+1})
                          RETURNING *
                      `,
        values: [...values, id_missao],
      };

      let { rows } = await this._db.query(query);
      return {
        msg: "Desafio criado com sucesso",
        row: rows,
      };
    }
    return {
      msg: "Você não é professor dessa aventura, não é possivel criar missão",
    };

  }

  async read(id_missao) {
    let { rows } = await this._db.query(
      `SELECT * from "Desafios" where "FK_missao" = ${id_missao}`
    );
    return {
      msg: "Desafio criado com sucesso",
      row: rows,
    };
  }

  async update(payload, id_desafio) {
    const values = Object.values(payload);
    const keys = Object.keys(payload);
    const query = {
      text: `
                    UPDATE "Desafios" SET ${keys.map(
                      (value, index) => `"${value}"=$${index + 1}`
                    )} WHERE "ID_desafio" = ${id_desafio} RETURNING *
                `,
      values,
    };
    let { rows } = await this._db.query(query);
    return {
      msg: "Desafio modificado com sucesso",
      row: rows,
    };
  }

  async delete(id_desafio) {
    const query = {
      text: `
                      DELETE FROM "Desafios" WHERE "ID_desafio" = ${id_desafio}
                  `,
    };
    await this._db.query(query);
    return {
      msg: "Desafio deletado do banco",
      err: false,
    };
  }
}

module.exports = DesafioDAO;
