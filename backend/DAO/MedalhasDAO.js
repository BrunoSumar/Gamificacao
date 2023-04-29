class MedalhasDAO {
  constructor(db) {
    this._db = db;
  }

  async create(payload) {
    try {
      const values = Object.values(payload);
      const query = {
        text: `
                  INSERT INTO "Medalhas" ("TXT_titulo", "NR_minimo")
                  VALUES ($1, $2)
                  RETURNING *
              `,
        values,
      };

      let { rows } = await this._db.query(query);
      return {
        msg: "Medalha criada no banco",
        row: rows,
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }

  async read() {
    try {
      let { rows } = await this._db.query(`select * from "Medalhas"`);
      return {
        msg: "Medalha resgatadas com sucesso",
        row: rows,
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(payload, key) {
    try {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `
                    UPDATE "Medalhas" SET ${keys.map(
                      (value, index) => `"${value}"=$${index + 1}`
                    )} WHERE "ID_medalha" = ${key} RETURNING *
                `,
        values,
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Medalha atualizada no banco",
        row: rows,
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }

  async delete(key) {
    try {
      const query = {
        text: `
                      DELETE FROM "Medalhas" WHERE "ID_medalha" = ${key}
                  `,
      };
      await this._db.query(query);
      return {
        msg: "Medalha deletada do banco",
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }
}
module.exports = MedalhasDAO