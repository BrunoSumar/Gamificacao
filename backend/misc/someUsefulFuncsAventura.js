async function isAventura(db, id_aventura) {
  const query = `select * from "Aventuras" where "ID_aventura" = ${id_aventura}`;
  const { rows } = await db.query(query);
  return !!rows.length;
}

module.exports = {
    isAventura
}
