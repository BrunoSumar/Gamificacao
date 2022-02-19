class AventuraDAO {
  constructor(db) {
    this._db = db;
  }

  async adiciona( aventura) {
    const colunas = Object.keys(aventura);
    const values = Object.values(aventura);

    console.log(`
      INSERT INTO aventura ( ${ colunas.map((_, i) => '$' + (i + 1))} )
      VALUES ( ${ colunas.map((_, i) => '$' + (i + colunas.length))} )
    `);

    try{
      // const { rows } = this._db.query(`
      //   INSERT INTO aventura ( ${ colunas.map((_, i) => i + 1)} )
      //   VALUES ( ${ colunas.map((_, i) => i + colunas.length)} } )
      // `, colunas.concat(values) );
    }
    catch( err ){
      console.error( err );
      throw err;
    }
  }
}

module.exports = AventuraDAO;

// idAventura
// FK_Professor
// Name
// Description
// isEvent
// ClassNumber
// dataInicio
// dataTermino
