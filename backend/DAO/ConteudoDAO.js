const { FactoryFileManager, hasAccessConteudoAluno, hasAccessConteudoProfessor } = require("../misc/someUsefulFuncsConteudo");

class ConteudoDAO {
  constructor(db, type, opts={}) {
    this._db = db;
    this._opts = opts;
    this.file_manager = [ type, opts ];
  }

  set file_manager([ type, opts ]){
    if( opts.id_conteudo ){
      return this._file_manager = this._db.query(`SELECT "TXT_path_arquivo" FROM "Conteudos" WHERE "ID_conteudo" = ${ opts.id_conteudo }`)
        .then( ({ rows }) => {
          if( rows.length < 1 )
            throw 'Conteúdo não encontrado';
          return rows[0];
        })
        .then( row => { return this._opts = { path: row.TXT_path_arquivo } })
        .then( opts => FactoryFileManager.createFileManager( type, opts ));
    }
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

  async read({ id_aluno = null, id_professor = null } ) {
    const id_conteudo = this._opts.id_conteudo;
    if( id_aluno && !(await hasAccessConteudoAluno( this._db, id_aluno, id_conteudo )) )
      throw "Aluno não tem acesso a esse conteúdo";

    if( id_professor && !(await hasAccessConteudoProfessor( this._db, id_professor, id_conteudo )) )
      throw "Professor não tem acesso a esse conteúdo";

    const file_manager = await this._file_manager;
    return {
      file_name: this._opts.path.match(/^\.\/conteudos\/.{36}-(.+)$/)[1],
      data: file_manager.buscar(),
    };
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
