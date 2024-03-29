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

async function isComentarioDeletado(db, id_comentario) {
  const query = `
          Select * from "Comentarios" where "ID_comentario" = ${id_comentario} AND "FL_deletado" IS NOT NULL
      `;
  const { rows } = await db.query(query);
  return !!(rows.length);
}

function buildCommentTree(comments, parentId) {
  const parentComments = comments.filter((c) => c.FK_referencia == parentId);
  const tree = [];
  parentComments.forEach((parent) => {
    const children = buildCommentTree(comments, parent.ID_comentario);
    const node = {
      ...parent,
      children,
    };
    tree.push(node);
  });

  return tree;
}
module.exports = {
  isUserComentario,
  isComentarioAventura,
  buildCommentTree,
  isComentarioDeletado,
};
