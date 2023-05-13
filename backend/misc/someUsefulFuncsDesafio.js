async function hasDesafios( db, id_missao ){
  const query = `SELECT * FROM "Desafios" WHERE "FK_missao" = ${id_missao}`;
  const { rows } = await db.query(query);
  return !!rows.length;
};

async function hasOpcoes( db, id_desafio ){
  const query = `SELECT * FROM "Opcoes" WHERE "FK_desafio" = ${id_desafio}`;
  const { rows } = await db.query(query);
  return !!rows.length;
};

function hasUniqueIndices( desafios ){
    const indices = desafios.map( d => d.NR_indice );
    return !indices.some((el,i) => indices.indexOf(el) !== i);
};

function hasUniqueAnwser( opcoes ){
    return opcoes.reduce( (acc,cur) => acc + cur.FL_opcao_certa, 0 ) === 1;
};

async function isDesafioMissao(db, id_desafio, id_missao) {
  const text = `
    SELECT 1 FROM "Desafios"
    WHERE "ID_desafio" = $1
    AND "FK_missao" = $2
  `;
  const values = [ id_desafio, id_missao ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

module.exports = {
  hasDesafios,
  hasOpcoes,
  hasUniqueIndices,
  hasUniqueAnwser,
  isDesafioMissao,
};
