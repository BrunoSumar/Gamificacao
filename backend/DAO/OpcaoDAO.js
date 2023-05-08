// const { hasDesafios, hasUniqueIndices } = require("../misc/someUsefulFuncsDesafio");
const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const {
  isAlunoAventura,
  isMissaoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class opcaoDAO {
  constructor(db) {
    this._db = db;
  };

  async create(id_aventura, id_missao, id_professor, payload) {
    return null;
  };

  async read(
    id_aventura,
    id_missao,
    { ID_aluno = null, ID_professor = null, ID_desafio = null }
  ) {
    return null;
  };

  async update( id_aventura, id_missao, id_professor, desafios ){
    return null;
  };
};


module.exports = opcaoDAO;
