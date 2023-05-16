const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const FactoryFileManager = require("../misc/someUsefulFuncsConteudo");

class ConteudoDAO {
  constructor(db, type, opts) {
    this._db = db;
    this._file_manager = FactoryFileManager.createFileManager( type, opts );
  }

  async create() {
    const current_date = new Date().toISOString();
    const text = `
      INSERT INTO "Conteudos"
      ( "TXT_path_arquivo", "DT_inclusao" )
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [ this._file_manager._path, current_date ];

    const { rows } = await this._db.query({ text, values });
    if( rows.length < 1 )
      throw 'Falha ao registrar conteúdo no banco';

    await this._file_manager.salvar();

    return rows[0];
  }

  async read() {
    return this._file_manager.buscar();
  }

  async update(payload, id_aventura, id_professor, id_missao) {
  }

  async deleteFile() {
    this._file_manager.deletar();
  }

  async delete() {
    const text =  `
      DELETE FROM "Conteudos"
      WHERE "TXT_path_arquivo" = $1
    `;
    const values = [ this._file_manager._path ]
    const { rows } = await this._db.query({ text, values });

    this._file_manager.deletar();
  }
}

module.exports = ConteudoDAO;
