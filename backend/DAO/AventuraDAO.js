const { queryInsert, queryValues } = require("../misc/someUsefulFuncsQuery");
const {
  isAlunoAventura,
  isProfessorAventura,
} = require("../misc/someUsefulFuncsMissao");

class AventuraDAO {
  constructor( db ) {
    this._db = db;
  }

  async create( aventura, id_professor ) {
    if( !aventura )
      return;

    const colunas = Object.keys( aventura ).map( chave => `"${ chave.trim() }"` );
    const values = Object.values(aventura);
    const values_query = values.map( (_, i) => `$${ i+1 }` );

    const text =  `
        INSERT INTO "Aventuras" ( ${ colunas } )
        VALUES (${ values_query })
        ON CONFLICT ("ID_google") DO NOTHING
        RETURNING "ID_aventura"
    `;

    try{
      const { rows: aventuras } = await this._db.query({ text, values });

      if( aventuras.length < 1 )
        return null;

      return aventuras[0].ID_aventura;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async createFromClassroom( aventuras ) {
    if( !aventuras )
      throw 'aventura inválida';

    const values = queryValues( aventuras );
    const text =  `
      INSERT INTO "Aventuras"
      ${ queryInsert( aventuras ) }
      ON CONFLICT ("ID_google") DO NOTHING
      RETURNING "ID_aventura", "ID_google"
    `;

    try{
      const { rows } = await this._db.query({ text, values });

      return rows;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async updateFromClassroom( id_aventura, alunos ) {
    if( !id_aventura || !alunos || alunos.length < 1  )
      return null;

    const text =  `
      INSERT INTO "Alunos_Aventuras" ( "FK_aluno", "FK_aventura")
      SELECT "ID_aluno", ${ id_aventura }  FROM "Alunos"
      WHERE "ID_google" IN (${ alunos.map(a => `'${a}'`) })
    `;

    try{
      const { rows } = await this._db.query( text );

      return rows;
    }
    catch( err ){
      console.error( err );
    }
  }

  async insertFromClassroom( id_aluno, aventuras ) {
    if( !aventuras )
      return;
    aventuras = [].concat( aventuras );

    const google_ids = aventuras.map( aventura => aventura.ID_google ).join();

    let connection = {};
    try{
      connection = await this._db.connect();

      await connection.query('BEGIN');

      const { rows: aventuras } = await connection.query( `
        SELECT "ID_aventura", "ID_google"
        FROM "Aventuras"
        WHERE "ID_google" IN (${ google_ids })
      `);

      if( aventuras.length < 1 )
        return [];

      if( id_aluno ){
        const aluno_aventuras = aventuras
              .map( aventura => `(${ id_aluno }, ${ aventura.ID_aventura })` )
              .join(',');

        const { rows } = await connection.query( `
          INSERT INTO "Alunos_Aventuras"
          ( "FK_aluno", "FK_aventura" )
          VALUES ${ aluno_aventuras }
        `);
      }

      await connection.query('COMMIT');
      return aventuras;
    }
    catch( err ){
      console.error( err );
      await connection.query('ROLLBACK');
      throw err;
    }
    finally{
      await connection.release();
    }
  }

  async read( { id_aluno, id_professor, id_aventura } ){
    if( id_aluno && id_professor )
      throw { msg: 'Mais de um ID valido fornecido' };

    const text = `
        SELECT "ID_aventura", "FK_professor", "TXT_nome", "TXT_descricao", "FL_evento",
          "TXT_numero_classe", "DT_inicio", "DT_termino"
        FROM "Aventuras"
        ${ !!id_aluno ? 'JOIN "Alunos_Aventuras" ON ("ID_aventura" = "FK_aventura")' : '' }
        WHERE
        ${ !!id_aluno ? '"FK_aluno"' : '"FK_professor"' } = $1
        ${ !!id_aventura ? 'AND "ID_aventura" = $2' : '' }
        ORDER BY "DT_inicio"
    `;
    const values = [ id_aluno, id_professor, id_aventura ].filter( x => x );

    try{
      const { rows } = await this._db.query( { text, values } );

      if( rows.length < 1)
        return null;

      return !!id_aventura ? rows[0] : rows ;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async insertAluno( id_aventura, id_professor, id_aluno ) {
    if( !id_aventura || !id_aluno )
      return null;

    if( !(await isProfessorAventura(this._db, id_professor, id_aventura)) )
      throw { status: 403, message: 'Professor não comanda a aventura' };

    if( await isAlunoAventura(this._db, id_aluno, id_aventura) )
      throw { status: 403, message: 'Aluno já pertence a aventura' };

    const values = [ id_aventura, id_aluno ];
    const text =  `
      INSERT INTO "Alunos_Aventuras" ( "FK_aventura", "FK_aluno" )
      VALUES ( $1, $2 )
      RETURNING *
    `;

    try{
      const { rows } = await this._db.query( text, values );

      return rows[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async update( id_aventura, id_professor, aventura ) {
    if( !aventura )
      return;

    const values = [ id_aventura, id_professor, ...Object.values( aventura ) ];
    const keys = Object.keys( aventura ).map((value, index) => `"${value}"=$${index + 3}`);
    const text =  `
        UPDATE "Aventuras"
        SET ${ keys }
        WHERE "ID_aventura" = $1
        AND  "FK_professor" = $2
        RETURNING "ID_aventura"
    `;
    try{
      const { rows: aventuras } = await this._db.query({ text, values });

      if( aventuras.length < 1 )
        throw 'Aventura não encontrada';

      return aventuras[0].ID_aventura;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async delete( id_aventura, id_professor ) {
    if( !id_aventura )
      return;

    const values = [ id_aventura, id_professor ];
    const text =  `
        DELETE FROM "Aventuras"
        WHERE "ID_aventura" = $1
        AND  "FK_professor" = $2
        RETURNING *
    `;

    try{
      const { rows: aventuras } = await this._db.query({ text, values });
      if( aventuras.length < 1 )
        return;

      return aventuras[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async deleteAluno( id_aventura, id_professor, id_aluno ) {
    if (!(await isProfessorAventura(this._db, id_professor, id_aventura)))
      throw "Esse usuario não é professor dessa aventura";

    const values = [ id_aventura, id_aluno ];
    const text =  `
      DELETE FROM "Alunos_Aventuras"
      WHERE "FK_aventura" = $1
      AND      "FK_aluno" = $2
      RETURNING *
    `;

    try{
      const { rows } = await this._db.query({ text, values });
      if( rows.length < 1 )
        return null;

      return rows[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }
}

module.exports = AventuraDAO;
