const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const FactoryFileManager = require("../misc/someUsefulFuncsConteudo");

class ConteudoDAO {
  constructor(db, type, file) {
    this._db = db;
    this._file_manager = FactoryFileManager.createFileManager( type, file );
  }

  async create() {
    const current_date = new Date().toISOString();
    const text = `
      INSERT INTO "Conteudos"
      ( "TXT_path_arquivo", "DT_inclusao" )
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [ this._path, current_date ];

    const { rows } = await this._db.query({ text, values });
    if( rows.length < 1 )
      throw 'Falha ao registrar conteúdo no banco';

    await this._file_manager.salvar();

    return rows[0];
  }

  async read(id_aventura, { id_aluno = null, id_professor = null }) {
  }

  async update(payload, id_aventura, id_professor, id_missao) {
  }

  async deleteFile() {
    this._file_manager.deletar();
  }

  async delete(id_missao, id_professor, id_aventura) {

  }
}

module.exports = ConteudoDAO;
