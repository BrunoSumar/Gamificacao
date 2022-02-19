class AventuraDAO {
  constructor( db ) {
    this._db = db;
  }

  async adiciona( aventura ) {
    const colunas = Object.keys(aventura).map( x => `"${ x }"` );
    const valores = Object.values(aventura);

    try{
      const { rows } = await this._db.query( `
        INSERT INTO "Aventura" ( ${ colunas.join(', ') })
        VALUES ( ${ colunas.map((_, i) => '$' + (i + 1)) } )
        RETURNING *
    `, valores);

      return rows[0];
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }

  async busca( id = null ){
    try{
      const is_aluno = req.auth.tipo === 1;

      const { rows } = await this._db.query( `
        SELECT idAventura, FK_Professor, Name, Description, isEvent, ClassNumber, dataInicio, dataTermino
        FROM "Aventura"
        ${ is_aluno ? 'JOIN "Aluno_Aventura" aa ON av.idAventura = aa.FK_Aventura' }
        WHERE ${ is_aluno ? 'FK_Aluno' : 'FK_Professor' } = $1
        ${ !!id ? 'idAventura = $2' : }
        ORDER BY dataInicio
      `, [ req.auth.id ].concat( id || [] ));

      if( rows.length < 1)
        return null;

      return !!id ? rows[0] : rows ;
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }
}

module.exports = AventuraDAO;
