
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
}

module.exports = AventuraDAO;
