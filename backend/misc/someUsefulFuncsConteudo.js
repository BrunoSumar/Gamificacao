const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FileManager{
  constructor( file  ) {
    this._file = file;
  };

  salvar(){};
  deletar(){};
};

class FileSystem extends FileManager{
  constructor( file ) {
    super(file);
    this._path = `./conteudos/${ uuidv4() }-${ file.filename }`;
  }

  async salvar(){
    fs.writeFileSync( this._path, await this._file.toBuffer() );
  }

  deletar(){
    fs.unlinkSync( this._path );
  }

};

class FactoryFileManager{
  static createFileManager( type, file ){
    switch( type ){
      case 'fs':
        return new FileSystem( file );
      default:
        'Tipo não suportado';
    }
  }

};

module.exports = FactoryFileManager;
