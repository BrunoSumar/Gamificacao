class PerfilDAO {
  constructor(db) {
    this._db = db;
  }

  async create(payload) {
    try {
      const values = Object.values(payload);
      const query = {
        text: `
                INSERT INTO "Avatar" ("FK_aluno", "TXT_cor_rgb", "TP_avatar")
                VALUES ($1, $2, $3)
                ON CONFLICT ("FK_aluno") DO NOTHING
            `,
        values,
      };

      let { rows } = await this._db.query(query);
      return {
        msg: "Avatar criado no banco",
        row: rows,
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }

  async read(payload) {
    try {
      const query = {
        text: `SELECT * from "Avatar" where "FK_aluno" = $1`,
        values: [payload],
      };
      let { rows } = await this._db.query(query);

      if (!rows || rows.length < 1) return null;

      return {
        msg: "Perfil encontrado",
        row: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(payload, key) {
    try {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `UPDATE "Avatar" SET ${keys.map((value, index) => `"${value}"=$${index + 1}`)} WHERE "FK_aluno" = ${key} RETURNING *`,
        values,
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Perfil Alterado",
        row: rows[0],
        err: false,
      };
    } catch (error) {
        throw error;
    }
  }

  async delete() {
    //Não Implementar
  }
}
module.exports = PerfilDAO