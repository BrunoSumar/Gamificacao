const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const {
  isUserComentario,
  buildCommentTree,
  isComentarioAventura,
  isComentarioDeletado
} = require("../misc/someUsefulFuncsComentarios");

class ComentarioDAO {
  constructor(db) {
    this._db = db;
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
          INSERT INTO "Comentarios" ("FK_aventura","FK_aluno","DT_criacao",${ keys.map( value => `"${value}"` ) })
          VALUES ($1,$2,$3,${keys.map((_, index) => `$${index + 4}`)})
          RETURNING *
        `,
        values: [id_aventura, ID_aluno, currentDate.toISOString(), ...values],
      };
      try {
        let { rows } = await this._db.query(query);
        return { message: "Comentario criado com sucesso", rows };
      } catch (error) {
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
        INSERT INTO "Comentarios" ("FK_aventura","FK_professor","DT_criacao",${keys.map(
          (value) => `"${value}"`
        )})
        VALUES ($1,$2,$3,${keys.map((_, index) => `$${index + 4}`)})
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
    if (!(await isComentarioAventura(this._db, id_comentario, id_aventura)))
      throw "O Comentario não pertence a essa aventura";
    if (
      !(await isUserComentario(this._db, id_comentario, {
        ID_aluno,
        ID_professor,
      }))
    )
      throw "O Comentario não pertence a esse usuario";
    if ((await isComentarioDeletado(this._db,id_comentario)))
      throw "Esse comentario já foi deletado";
    try {
      const currentDate = new Date();
      const values = Object.values(payload);
      const keys = Object.keys(payload);
      const query = {
        text: `UPDATE "Comentarios" SET ${keys.map(
          (value, index) => `"${value}"=$${index + 1}`
        )}, "FL_editado"=${true}, "DT_editado"='${currentDate.toISOString()}' WHERE "ID_comentario" = ${id_comentario} RETURNING *`,
        values,
      };
      let { rows } = await this._db.query(query);
      return {
        message: "Comentario editado com sucesso",
        rows,
      };
    } catch (error) {
      throw "Não foi possivel editar o comentario";
    }
  }

  async read(id_aventura, { ID_aluno = null, ID_professor = null }) {
    if (!ID_aluno && !ID_professor)
      throw { status: 403, message: "Esse não é um usuario valido" };
    if (
      ID_professor &&
      !(await isProfessorAventura(this._db, ID_professor, id_aventura))
    )
      throw { status: 403, message: "Professor não pertence a aventura" };
    if (ID_aluno && !(await isAlunoAventura(this._db, ID_aluno, id_aventura)))
      throw { status: 403, message: "Aluno não pertence a aventura" };

    const query = `WITH RECURSIVE comentarios_recursivo AS (
      SELECT *
      FROM "Comentarios"
      WHERE "FK_referencia" IS NULL
    
      UNION ALL
  
      SELECT c.*
      FROM "Comentarios" c
      INNER JOIN comentarios_recursivo cr ON c."FK_referencia" = cr."ID_comentario"
    )
    SELECT *
    FROM comentarios_recursivo
    ORDER BY "DT_criacao" ASC;`;

    const { rows } = await this._db.query(query);
    return buildCommentTree(rows, null);
  }
  async delete(
    id_aventura,
    id_comentario,
    { ID_aluno = null, ID_professor = null }
  ) {
    if (!(await isComentarioAventura(this._db, id_comentario, id_aventura)))
      throw "O Comentario não pertence a essa aventura";
    if (
      !(await isUserComentario(this._db, id_comentario, {
        ID_aluno,
        ID_professor,
      }))
    )
      throw "O Comentario não pertence a esse usuario";
    if ((await isComentarioDeletado(this._db,id_comentario)))
      throw "Esse comentario já foi deletado";
    try {
      const currentDate = new Date();
      const query = `UPDATE "Comentarios" SET "TXT_comentario"= 'O usuario deletou essa mensagem' , "FL_deletado"=${true}, "DT_deletado"='${currentDate.toISOString()}' WHERE "ID_comentario" = ${id_comentario} RETURNING *`;

      let { rows } = await this._db.query(query);
      return {
        message: "Comentario deletado com sucesso",
        rows,
      };
    } catch (error) {
      throw "Não foi possivel deletar o comentario";
    }
  }
}

module.exports = ComentarioDAO;
