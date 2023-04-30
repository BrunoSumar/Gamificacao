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
    if (
      isAlunoAventura(this._db, ID_aluno, id_aventura) &&
      ~hasGrupo(id_missao, ID_aluno)
    ) {
      const currentDate = new Date();
      const query = `
            INSERT INTO "Grupos" ("FK_missao","DT_criacao")
            VALUES (${id_missao}, ${currentDate.toISOString()})
            RETURNING *
        `;
      const { rows } = this._db.query(query);
      return {
        Message: "Grupo Criado",
        row:rows[0],
      };
    }
  }
  
  async read(
    id_aventura,
    id_missao,
    { ID_aluno = null, ID_professor = null }
  ) {}
  async update(id_aventura, id_missao, ID_aluno) {}
  async delete(id_aventura, id_missao, ID_aluno) {}
}