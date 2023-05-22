const { isAventura,  } = require("../misc/someUsefulFuncsAventura");
const {
  isProfessorAventura,
  isAlunoAventura,
  isMissaoAventura,
  isAntesTerminoAventura,
} = require("../misc/someUsefulFuncsMissao");

class MissaoDAO {
  constructor(db) {
    this._db = db;
  }

  async create(payload, id_aventura, id_professor) {
    console.log( payload, id_aventura, id_professor )
    if ( !(await isProfessorAventura(this._db, id_professor, id_aventura)) )
      throw "Esse professor não é mestre dessa aventura";

    if ( !(await isAntesTerminoAventura(this._db, id_aventura, payload.DT_entrega_maxima)) )
      throw "Data de entrega depois do termino da aventura";

    const values = Object.values(payload);
    const keys = Object.keys(payload);
    const query = {
      text: `
          INSERT INTO "Missoes" ("FK_aventura",${keys.map((value) => `"${value}"`)})
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
      `,
      values: [id_aventura, ...values],
    };
    let { rows } = await this._db.query(query);
    return {
      message: "A Missão foi criada no banco",
      rows,
    };
  }

  async read(id_aventura, { id_aluno = null, id_professor = null }) {
    if ( id_professor && !(await isProfessorAventura(this._db, id_professor, id_aventura)) )
      throw "Professor não é mestre dessa aventura";

    if ( id_aluno && !(await isAlunoAventura(this._db, id_aluno, id_aventura)) )
      throw "Aluno não é mestre dessa aventura";

    const query = `select * from "Missoes" where "FK_aventura" = ${id_aventura}`;
    let { rows } = await this._db.query(query);
    return {
      message: "Missões recuperadas com sucesso",
      rows,
    };
  }

  async update(payload, id_aventura, id_professor, id_missao) {
    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)) )
      throw "Professor não é mestre dessa aventura";

    const values = Object.values(payload);
    const keys = Object.keys(payload);

    const text = `
        UPDATE "Missoes"
        SET ${ keys.map( (value, index) => `"${value}"=$${index + 1}` ) }
        WHERE "ID_missao" = $${values.length + 1}
        RETURNING *
      `;
    let { rows } = await this._db.query({ text, values: [...values, id_missao] });
    return {
      message: "A Missão foi alterada no banco",
      rows,
    };
  }

  async delete(id_missao, id_professor, id_aventura) {
    if (isProfessorAventura(this._db, id_professor, id_aventura)) {
      const query = {
        text: `
            DELETE FROM "Missoes" WHERE "ID_missao" = ${id_missao}
        `,
      };
      await this._db.query(query);
      return {
        msg: "Missao deletada do banco",
      };
    }
  }
}

module.exports = MissaoDAO;
