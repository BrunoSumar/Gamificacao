const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FileManager{
  constructor( file  ) {
    this._file = file;
  };

  salvar(){};
  buscar(){};
  deletar(){};
};

class FileSystem extends FileManager{
  constructor({ file = null, path = null }) {
    super(file);
    this._path = path || `./conteudos/${ uuidv4() }-${ file?.filename }`;
  }

  async salvar(){
    this._file && fs.writeFileSync( this._path, await this._file.toBuffer() );
  };

  buscar(){
    return fs.readFileSync( this._path );
  };

  deletar(){
    try{
      fs.accessSync( this._path, fs.constants.W_OK );
      fs.unlinkSync( this._path );
      return true;
    }
    catch(err){
      return false;
    }
  };

};

class FactoryFileManager{
  static createFileManager( type, opts ){
    switch( type ){
      case 'fs':
        return new FileSystem( opts );
      default:
        throw 'Tipo não suportado';
    }
  }

};

async function hasAccessConteudoAluno( db, id_aluno, id_conteudo ){
  const text = `
    WITH grupos_aluno AS (
      SELECT "FK_grupo" FROM "Grupos_Alunos"
      WHERE "FK_aluno" = $1
    ),
    respostas_aluno AS (
      SELECT "FK_conteudo", "ID_resposta" FROM "Respostas"
      WHERE "FK_conteudo" IS NOT NULL
      AND (
        "FK_aluno" = $1 OR "FK_grupo" IN ( SELECT "FK_grupo" FROM grupos_aluno )
      )
    ),
    desafios_aluno AS (
      SELECT "FK_conteudo", "ID_desafio" FROM "Desafios" d
      JOIN "Missoes" m ON ("FK_missao" = "ID_missao")
      JOIN "Alunos_Aventuras" aa ON (m."FK_aventura" = aa."FK_aventura")
      WHERE aa."FK_aluno" = $1
      AND "FK_conteudo" IS NOT NULL
    )
    SELECT 1 FROM "Conteudos"
    LEFT JOIN respostas_aluno ra ON ( ra."FK_conteudo" = "ID_conteudo" )
    LEFT JOIN desafios_aluno da ON ( da."FK_conteudo" = "ID_conteudo" )
    WHERE ( "ID_resposta" IS NOT NULL OR "ID_desafio" IS NOT NULL )
    AND "ID_conteudo" = $2
  `;
  const values = [ id_aluno, id_conteudo ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

async function hasAccessConteudoProfessor( db, id_professor, id_conteudo ){
  const text = `
    WITH desafios_professor AS (
      SELECT "FK_conteudo", "ID_desafio" FROM "Desafios"
      JOIN "Missoes" ON ( "FK_missao" = "ID_missao" )
      JOIN "Aventuras" ON ( "FK_aventura" = "ID_aventura" )
      WHERE "FK_professor" = $1
    ),
    respostas_professor AS (
      SELECT r."FK_conteudo", "ID_resposta" FROM "Respostas" r
      JOIN desafios_professor dp ON ( "FK_desafio" = "ID_desafio" )
    )
    SELECT * FROM "Conteudos"
    LEFT JOIN respostas_professor rp ON ( rp."FK_conteudo" = "ID_conteudo" )
    LEFT JOIN desafios_professor dp ON ( dp."FK_conteudo" = "ID_conteudo" )
    WHERE ( "ID_resposta" IS NOT NULL OR "ID_desafio" IS NOT NULL )
    AND "ID_conteudo" = $2
  `;
  const values = [ id_professor, id_conteudo ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

module.exports = {
  FactoryFileManager,
  hasAccessConteudoAluno,
  hasAccessConteudoProfessor,
};
