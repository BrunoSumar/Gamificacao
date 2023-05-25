async function isAventura(db, id_aventura) {
  const query = `select * from "Aventuras" where "ID_aventura" = ${id_aventura}`;
  const { rows } = await db.query(query);
  return !!rows.length;
}

async function isAventuraAtiva(db, id_aventura) {
  const currentDate = new Date();
  const text = `
    select * from "Aventuras"
    where "ID_aventura" = ${id_aventura}
    and "DT_termino" > $1
  `;
  const values = [ currentDate.toISOString() ];

  const { rows } = await db.query({ text, values });
  return !!rows.length;
}

module.exports = {
    isAventura,
    isAventuraAtiva
}
