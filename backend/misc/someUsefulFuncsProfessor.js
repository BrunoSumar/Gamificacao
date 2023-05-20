async function isProfessor(db, id_professor) {
  const query = `
          Select * from "Professores" where "ID_professor" = ${id_professor}
      `;
  const { rows } = await db.query(query);
  return !!(rows.length > 0);
}

module.exports = {
  isProfessor,
};
