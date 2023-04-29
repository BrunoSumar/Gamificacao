class AventuraDAO {
  constructor( db ) {
    this._db = db;
  }

  async create( aventura ) {
    if( !aventura )
      return;

    const colunas = Object.keys( aventura ).map( chave => `"${ chave.trim() }"` );
    const values = Object.values(aventura);
    const values_query = `(${ values.map( (_, i) => `$${ i+1 }` ) })`;

    const text =  `
        INSERT INTO "Aventuras" ( ${ colunas } )
        VALUES ${ values_query }
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

  async createFromClassroom( id_aluno, aventuras ) {
    if( !aventuras )
      return;
    aventuras = [].concat( aventuras );

    const colunas = Object
          .keys( aventuras[0] )
          .map( chave => `"${ chave.trim() }"` );

    const valores = aventuras
          .map( aventura => Object.values(aventura) )
          .reduce( (acc, aventura) => acc.concat( aventura ) );

    const tam = colunas.length;
    const valores_query = aventuras
          .map( (_, i) => colunas.map((_, j) => '$' + (tam * i + j + 1)) )
          .map( val => `(${ val })` );

    const google_ids = aventuras.map( aventura => aventura.ID_google ).join();

    let connection = {};
    try{
      connection = await this._db.connect();

      await connection.query('BEGIN');

      await connection.query( `
        INSERT INTO "Aventuras" ( ${ colunas } )
        VALUES ${ valores_query }
        ON CONFLICT ("ID_google") DO NOTHING
        RETURNING "ID_aventura"
      `, valores);

      const { rows: aventuras } = await connection.query( `
        SELECT "ID_aventura"
        FROM "Aventuras"
        WHERE "ID_google" IN (${ google_ids })
      `);

      if( aventuras.length < 1 )
        return null;

      if( id_aluno ){
        const aluno_aventuras = aventuras
              .map( aventura => `(${ id_aluno }, ${ aventura.ID_aventura }, 0)` )
              .join(',');

        const { rows } = await connection.query( `
          INSERT INTO "Alunos_Aventuras" ( "FK_aluno", "FK_aventura", "NR_porcentagem_conclusao" )
          VALUES ${ aluno_aventuras } RETURNING *
        `);
      }

      await connection.query('COMMIT');
      return aventuras.map( row => row.ID_aventura );
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

  async insertAluno( id_aventura, id_aluno ) {
    if( !id_aventura || !id_aluno )
      return null;

    const text =  `
      INSERT INTO "Alunos_Aventuras" ( "FK_aluno", "FK_aventura", "NR_porcentagem_conclusao" )
      VALUES (${ id_aluno }, ${ id_aventura }, 0)
      RETURNING *
    `;

    try{
      const { rows } = await this._db.query( text );

      return rows[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async update( id_aventura, aventura ) {
    if( !aventura )
      return;

    const keys = Object.keys( aventura ).map((value, index) => `"${value}"=$${index + 2}`);
    const values = [ id_aventura, ...Object.values( aventura ) ];
    const text =  `
        UPDATE "Aventuras"
        SET ${ keys }
        WHERE "ID_aventura" = $1
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

  async delete( id_aventura, id_professor ) {
    if( !id_aventura )
      return;

    const values = [ id_aventura, id_professor ];
    const text =  `
        DELETE FROM "Aventuras"
        WHERE "ID_aventura" = $1
        AND "FK_professor" = $2
        RETURNING *
    `;

    try{
      const { rows: aventuras } = await this._db.query({ text, values });
      if( aventuras.length < 1 )
        return

      return aventuras[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }
}

module.exports = AventuraDAO;
