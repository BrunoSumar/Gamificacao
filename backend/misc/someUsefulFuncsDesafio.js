async function hasDesafios( db, id_missao ){
  const query = `SELECT * FROM "Desafios" WHERE "FK_missao" = ${id_missao}`;
  const { rows } = await db.query(query);
  return !!rows.length;
};

function hasUniqueIndices( desafios ){
    const indices = desafios.map( d => d.NR_indice );
    console.log( indices )
    return !indices.some((el,i) => indices.indexOf(el) !== i);
};

module.exports = {
    hasDesafios,
    hasUniqueIndices,
};
