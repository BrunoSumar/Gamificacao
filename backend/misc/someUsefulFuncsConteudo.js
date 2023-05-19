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
  }

  buscar(){
    return fs.readFileSync( this._path );
  };

  deletar(){
    fs.unlinkSync( this._path );
  }


};

class FactoryFileManager{
  static createFileManager( type, opts ){
    switch( type ){
      case 'fs':
        return new FileSystem( opts );
      default:
        'Tipo não suportado';
    }
  }

};

async function hasAccessConteudoAluno( db, id_conteudo, id_aluno ){
  const text = `
    WITH grupos_aluno AS (
      SELECT "FK_grupo" FROM "Grupos_Alunos"
      WHERE "FK_aluno" = ${ id_aluno }
    ),
    respostas_aluno AS (
      SELECT "FK_conteudo", "ID_resposta" FROM "Respostas"
      WHERE "FK_conteudo" IS NOT NULL
      AND (
        "FK_aluno" = ${ id_aluno } OR "FK_grupo" IN ( SELECT "FK_grupo" FROM grupos_aluno )
      )
    ),
    desafios_aluno AS (
      SELECT "FK_conteudo", "ID_desafio" FROM "Desafios" d
      JOIN "Missoes" m ON ("FK_missao" = "ID_missao")
      JOIN "Alunos_Aventuras" aa ON (m."FK_aventura" = aa."FK_aventura")
      WHERE r."FK_aluno" = ${ id_aluno }
      AND "FK_conteudo" IS NOT NULL
    )
    SELECT 1 FROM "Conteudos"
    LEFT JOIN respostas_aluno ra ON ( ra."FK_conteudo" = "ID_Conteudo" )
    LEFT JOIN desafios_aluno da ON ( da."FK_conteudo" = "ID_Conteudo" )
    WHERE ( "ID_reposta" IS NOT NULL OR "ID_desafio" IS NOT NULL )
    AND "ID_conteudo" = ${ id_conteudo  }
  `;
  console.log( text )
  const values = [ id_grupo ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

async function hasAccessConteudoProfessor( id_conteudo, id_professor ){
  const text = `
    SELECT 1 FROM "Conteudos"
    LEFT JOIN "Respostas" ON (
"Respostas.FK_conteudo" = "ID_Conteudo"
"")
    LEFT JOIN "Missoes" ON ( "Missoes.FK_conteudo" = "ID_Conteudo" )
    WHERE ( "ID_missao" IS NOT NULL OR "ID_resposta" IS NOT NULL )
  `;
  const values = [ id_grupo ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

module.exports = {
  FactoryFileManager,
  hasAccessConteudoAluno,
};
