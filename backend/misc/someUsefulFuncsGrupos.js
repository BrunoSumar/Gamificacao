async function isMissaoEmGrupo(db, id_missao) {
  const query = `SELECT * FROM "Missoes" WHERE "ID_missao" = ${id_missao} AND "FL_grupo" = TRUE`;
  const { rows } = await db.query(query);
  return !!rows.length;
};

async function isDeletaGrupo(db, id_grupo) {
  const query = `SELECT COUNT(1) AS qtd FROM "Grupos_Alunos" WHERE "FK_grupo" = ${id_grupo}`;
  const { rows } = await db.query(query);
  return !rows[0].qtd;
};

async function hasGrupo(db, id_missao, id_aluno) {
  const query = `
    SELECT 1
    FROM "Missoes" JOIN "Grupos" ON ("ID_missao" = "FK_missao")
    JOIN "Grupos_Alunos" ON ("FK_grupo" = "ID_grupo")
    WHERE "ID_missao" = ${id_missao} AND "FK_aluno" = ${id_aluno}
  `;
  const { rows } = await db.query(query);
  return !!rows.length;
};

async function isGrupo(db, id_grupo) {
  const text = `
    SELECT 1 FROM "Grupos"
    WHERE "ID_grupo" = $1
  `;
  const values = [ id_grupo ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

module.exports = {
  isMissaoEmGrupo,
  hasGrupo,
  isDeletaGrupo,
  isGrupo
};
