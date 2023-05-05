const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const {
  isUserComentario,
  isComentarioAventura,
} = require("../misc/someUsefulFuncsComentarios");

class ComentarioDAO {
  constructor(db) {
    this.__db = db;
  }

  async create(payload, id_aventura, { ID_aluno = null, ID_professor = null }) {
    const currentDate = new Date();

    if (ID_aluno) {
      if (!(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
        throw { status: 403, message: "Aluno não pertence a aventura" };
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const query = {
        text: `
                    INSERT INTO "Comentarios" ("FK_aventura","FK_aluno","FL_editado", "DT_criacao","DT_editado", ${keys.map(
                      (value) => `"${value}"`
                    )})
                    VALUES (${keys.map((_, index) => `$${index + 1}`)})
                    RETURNING *
                `,
        values: [
          id_aventura,
          ID_aluno,
          false,
          currentDate.toISOString(),
          null,
          ...values,
        ],
      };
      try {
        let { rows } = await this._db.query(query);
        return { message: "Comentario criado com sucesso", rows };
      } catch (error) {
        console.log(error);
        throw "Não foi possivel criar o comentario";
      }
    }

    if (ID_professor) {
      if (!(await isProfessorAventura(this._db, ID_professor, id_aventura)))
        throw { status: 403, message: "Professor não pertence a aventura" };
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      const query = {
        text: `
                    INSERT INTO "Comentarios" ("FK_aventura","FK_professor","FL_editado","DT_criacao", "DT_editado", ${keys.map(
                      (value) => `"${value}"`
                    )})
                    VALUES (${keys.map((_, index) => `$${index + 1}`)})
                    RETURNING *
                `,
        values: [
          id_aventura,
          ID_professor,
          false,
          currentDate.toISOString(),
          null,
          ...values,
        ],
      };
      try {
        let { rows } = await this._db.query(query);
        return { message: "Comentario criado com sucesso", rows };
      } catch (error) {
        console.log(error);
        throw "Não foi possivel criar o comentario";
      }
    }

    throw "Esse não é um usuario valido!";
  }

  async update(
    payload,
    id_aventura,
    id_comentario,
    { ID_aluno = null, ID_professor = null }
  ) {
    if (!(await isComentarioAventura(this.__db, id_comentario, id_aventura)))
      throw "O Comentario não pertence a essa aventura";
    if (!(await isUserComentario(this.__db, id_comentario, { ID_aluno, ID_professor})))
      throw "O Comentario não pertence a esse usuario";
    try {
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `UPDATE "Comentarios" SET ${keys.map(
          (value, index) => `"${value}"=$${index + 1}`
        )} 
        "FL_editado" = ${true}
        "DT_editado" = ${currentDate.toISOString()}
        WHERE "ID_comentario" = ${id_comentario} 
        RETURNING *`,
        values,
      };
      let { rows } = await this._db.query(query);
      return {
        message: "Comentario editado com sucesso",
        rows,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel editar o comentario";
    }
  }
  
  async read() {}
  async delete() {}
}
