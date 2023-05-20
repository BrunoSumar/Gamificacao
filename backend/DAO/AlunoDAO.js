class AlunoDAO {
  constructor(db) {
    this._db = db;
  }

  async create(aluno) {
    try {
      const values = Object.values(aluno);
      const keys = Object.keys(aluno);
      const query = {
        text: `
          INSERT INTO "Alunos" (${keys.map((item) => `"${item}"`)})
          VALUES (${keys.map((_, index) => `$${index + 1}`)})
          RETURNING *
      `,
        values,
      };

      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno inserido no banco",
        rows: rows[0],
        err: false,
      };
    } catch (e) {
      throw e;
    }
  }

  async readIdGoogle(googleId) {
    try {
      const query = {
        text: `SELECT * from "Alunos" where "ID_google" = $1`,
        values: [googleId],
      };

      let { rows } = await this._db.query(query);
      if (!rows || rows.length < 1) return null;
      return {
        msg: "Aluno encontrado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async readByID(ID_aluno) {
    try {
      const query = {
        text: `SELECT "TXT_primeiro_nome", "TXT_ultimo_nome", "TXT_num_matricula", "TXT_email", "NR_moedas"  from "Alunos" where "ID_aluno" = $1`,
        values: [ID_aluno],
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno encontrado",
        rows,
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async read() {
    try {
      const query = `SELECT "TXT_primeiro_nome", "TXT_ultimo_nome", "TXT_num_matricula" from "Alunos" `;
      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno encontrado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(payload, ID_aluno) {
    try {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `UPDATE "Alunos" SET ${keys.map(
          (value, index) => `"${value}"=$${index + 1}`
        )} WHERE "ID_aluno" = $${values.length + 1} RETURNING *`,
        values: [...values, ID_aluno],
      };
      let { rows } = await this._db.query(query);
      return {
        msg: "Aluno Atualizado",
        rows: rows[0],
        err: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(ID_aluno) {
    const currentDate = new Date();
    const query = {
      text: `UPDATE "Alunos" SET 
    "ID_google" = $1 ,
    "TXT_primeiro_nome" = $2 ,
    "TXT_ultimo_nome" = $3,
    "TXT_num_matricula" = $4,
    "TXT_email" = $5,
    "NR_moedas" = $6,
    "FL_deletado" = $7,
    "DT_deletado"= $8
    WHERE ID_aluno = $9`,
      values: [
        null,
        "Usuario deletado",
        "Usuario deletado",
        "Usuario deletado",
        "Usuario deletado",
        null,
        true,
        currentDate.toISOString(),
        ID_aluno,
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

module.exports = AlunoDAO;
