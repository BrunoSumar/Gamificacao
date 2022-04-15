
class AventuraDAO {
  constructor( db ) {
    this._db = db;
  }

  async adiciona( aventuras ) {
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

    try{
      const { rows } = await this._db.query( `
        INSERT INTO "Aventuras" ( ${ colunas } )
        VALUES ${ valores_query }
        ON CONFLICT ("ID_google") DO NOTHING
        RETURNING "ID_aventura"
      `, valores);
      return rows.map( row => row.ID_aventura );
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async busca( is_aluno, id_usuario, id_aventura = null  ){
    try{
      const { rows } = await this._db.query( `
        SELECT "ID_aventura", "FK_professor", "name", "description", "is_event", "class_number", "data_inicio", "data_termino"
        FROM "Aventuras"
        ${ is_aluno ? 'JOIN "Alunos_Aventuras" ON "ID_aventura" = "FK_aventura"' : '' }
        WHERE
        ${ is_aluno ? '"FK_aluno"' : '"FK_professor"' } = $1
        ${ !!id_aventura ? 'AND "ID_aventura" = $2' : '' }
        ORDER BY "data_inicio"
      `, [ id_usuario ].concat( id_aventura || [] ));

      console.log(`
        SELECT "ID_aventura", "FK_professor", "name", "description", "is_event", "class_number", "data_inicio", "data_termino"
        FROM "Aventuras"
        ${ is_aluno ? 'JOIN "Alunos_Aventuras" ON "ID_aventura" = "FK_aventura"' : '' }
        WHERE
        ${ is_aluno ? '"FK_aluno"' : '"FK_professor"' } = $1
        ${ !!id_aventura ? 'AND "ID_aventura" = $2' : '' }
        ORDER BY "data_inicio"
      `, is_aluno, id_usuario)
      if( rows.length < 1)
        return null;

      return !!id_aventura ? rows[0] : rows ;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async adicionaAluno( id_aventura, id_aluno ) {
    try{
      const { rows } = await this._db.query( `
        INSERT INTO "Alunos_Aventuras" ( "FK_aluno", "FK_aventura", "porcentagem_conclusao" )
        VALUES ( $2, $3, 0 )
        RETURNING *
      `, [ id_aluno, id_aventura ]);

      return rows[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }
}

module.exports = AventuraDAO;
