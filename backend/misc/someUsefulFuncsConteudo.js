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

module.exports = FactoryFileManager;
