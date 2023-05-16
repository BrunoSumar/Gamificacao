class ProfessorDAO {
  constructor(db) {
    this._db = db;
  }

  async create(professor) {
    const values = Object.values(professor);
    const keys = Object.keys(professor);
    const query = {
      text: `
        INSERT INTO "Professores" (${keys.map((item) => `"${item}"`)})
        VALUES (${keys.map((_, index) => `$${index + 1}`)})
        RETURNING *
    `,
      values,
    };

    try {
      let { rows } = await this._db.query(query);
      return {
        msg: "Professor inserido no banco",
        row: rows[0],
        err: false,
      };
    } catch (e) {
      throw {
        msg: "Erro ao inserir professor no banco",
        row: null,
        err: e,
      };
    }
  }

  async readIdGoogle(googleId) {
    try {
      const query = {
        text: `SELECT * from "Professores" where "ID_google" = $1`,
        values: [googleId],
      };
      let { rows } = await this._db.query(query);

      if (!rows || rows.length < 1) return null;

      return {
        msg: "Professor encontrado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async readById(ID_professor) {
    try {
      const query = {
        text: `SELECT "TXT_primeiro_nome", "TXT_ultimo_nome","TXT_num_professor" from "Professores" where "ID_professor" = $1`,
        values: [ID_professor],
      };
      let { rows } = await this._db.query(query);

      return {
        msg: "Professor encontrado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async read(ID_professor) {
    try {
      const query = {
        text: `SELECT "TXT_primeiro_nome", "TXT_ultimo_nome","TXT_num_professor" from "Professores"`,
        values: [ID_professor],
      };
      let { rows } = await this._db.query(query);

      return {
        msg: "Professores encontrados",
        rows,
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(payload, ID_professor) {
    try {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `UPDATE "Professores" SET ${keys.map(
          (value, index) => `"${value}"=$${index + 1}`
        )} WHERE "ID_professor" = $${values.length + 1} RETURNING *`,
        values: [...values, ID_professor],
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Professor Atualizado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(ID_professor) {
    const currentDate = new Date();
    const query = {
      text: `UPDATE "Alunos" SET 
      "ID_google" = $1
      "TXT_num_professor" = $2
      "TXT_primeiro_nome" = $3
      "TXT_ultimo_nome" = $4
      "TXT_email" = $5
      "FL_validado" = $6
      "FL_deletado" = $7
      "DT_deletado" = $8
      WHERE "ID_professor" = $9`,
      values: [
        null,
        "Usuario deletado",
        "Usuario deletado",
        "Usuario deletado",
        "Usuario deletado",
        null,
        true,
        currentDate.toISOString(),
        ID_professor,
      ],
    };
    try {
      const { rows } = await this._db.query(query);
      return {
        message: "Usuario deletado com sucesso",
        rows,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel deletar o aluno";
    }
  }
}

module.exports = ProfessorDAO;
