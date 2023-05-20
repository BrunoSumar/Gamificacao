async function isAdminUnique(db, user) {
  const query = {
    text: `SELECT 1 from "Administrador"
        WHERE "TXT_USER" = $1`,
    values: [user],
  };
  rows = await db.query(query);
  return !!rows.length;
}

module.exports = {
    isAdminUnique
}