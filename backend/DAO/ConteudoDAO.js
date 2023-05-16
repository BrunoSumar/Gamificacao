const {
  isProfessorAventura,
  isAlunoAventura,
} = require("../misc/someUsefulFuncsMissao");

const fs = require('fs');

class ConteudoDAO {
  constructor(db) {
    this._db = db;
  }

  //Somente professor
  async create(path, conteudo) {
    console.log( conteudo )
    const current_date = new Date().toISOString();
    const text = `
      INSERT INTO "Conteudos"
      ( "TXT_path_arquivo", "DT_inclusao" )
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [ path, current_date ];

    const { rows } = await this._db.query({ text, values });
    if( rows.length < 1 )
      throw 'Falha ao registrar conteúdo no banco';

    fs.writeFileSync( path, conteudo );
    // const writeStream = fs.createWriteStream( path );

    // await conteudo.pipe(writeStream);
    // await writeStream;

    console.log( rows )
    return rows[0];
  }

  async read(id_aventura, { id_aluno = null, id_professor = null }) {
  }

  //somente professor
  async update(payload, id_aventura, id_professor, id_missao) {
  }

  //somente professor
  async delete(id_missao, id_professor, id_aventura) {
  }
}

module.exports = ConteudoDAO;
