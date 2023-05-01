const {
  hasGrupo,
  isDeletaGrupo,
  isMissaoEmGrupo,
} = require("../misc/someUsefulFuncsGrupos");
const {
  isAlunoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class GruposDAO {
  constructor(db) {
    this._db = db;
  }

  async create(id_aventura, id_missao, ID_aluno) {
    if( !(await isAlunoAventura(this._db, ID_aluno, id_aventura)) )
      throw { status: 403, message: 'Aluno não pertence a aventura' };
    console.log( 1 )

    return null;
    // if( !(await hasGrupo(this._db, id_missao, ID_aluno)) )
    //   throw { status: 403, message: 'Aluno já pertence um grupo' };
    // console.log( 2 )

    // const currentDate = new Date();
    // const query = `
    //   INSERT INTO "Grupos" ("FK_missao","DT_criacao")
    //   VALUES (${id_missao}, '${currentDate.toISOString()})'
    //   RETURNING *
    // `;
    // console.log( query )
    // const { rows } = await this._db.query(query);
    // return {
    //   Message: "Grupo Criado",
    //   row:rows[0],
    // };
  }
  
  async read(
    id_aventura,
    id_missao,
    { ID_aluno = null, ID_professor = null }
  ) {}
  async update(id_aventura, id_missao, ID_aluno) {}
  async delete(id_aventura, id_missao, ID_aluno) {}
}

module.exports = GruposDAO;
