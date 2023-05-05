async function isUserComentario(
  db,
  id_comentario,
  { ID_aluno = null, ID_professor = null }
) {
  const query = `
        Select * from "Comentarios" where "ID_comentario" = ${id_comentario}
    `;
  const { rows } = await db.query(query);
  return !!(
    (rows[0].FK_aluno == ID_aluno) |
    (rows[0].FK_professor == ID_professor)
  );
}

async function isComentarioAventura(db, id_comentario, id_aventura) {
  const query = `
          Select * from "Comentarios" where "ID_comentario" = ${id_comentario}
      `;
  const { rows } = await db.query(query);
  return !!(rows[0].FK_aventura == id_aventura);
}

module.exports = {
  isUserComentario,
  isComentarioAventura
};
