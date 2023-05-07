async function __verificaMissaoProfessor(id_missao, id_professor, db) {
  query = `
      SELECT "Missoes.ID_missao","Missoes.FK_aventura","Aventuras.ID_aventura","Aventuras.FK_professor" 
      from "Missoes"
      join "Aventuras"
      on "Missoes.FK_aventura" = "Aventuras.ID_aventura"
      where "Missoes.ID_missao" = ${id_missao} AND "Aventuras.FK_professor" = ${id_professor}
    `;
  let { rows } = await db.query(query);
  if (rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
    __verificaMissaoProfessor()
}