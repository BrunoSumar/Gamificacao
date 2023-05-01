async function isMissaoEmGrupo(db, id_missao) {
  const query = `SELECT * from "Missoes" WHERE "ID_missao" = ${id_missao} AND "FL_grupo" = TRUE`;
  const { rows } = await db.query(query);
  return !!rows.length;
};

async function isDeletaGrupo(db, id_grupo) {
  const query = `SELECT count(1) as qtd from "Grupos_Alunos" WHERE "FK_grupo" = ${id_grupo};`;
  const { rows } = await db.query(query);
  return !rows[0].qtd;
};

async function hasGrupo(db, id_missao, id_aluno) {
  const query = `
    SELECT * FROM "Missoes" JOIN "Grupos"
    ON ("Missoes.ID_missao" = "Grupos.FK_missao")
    JOIN "Grupos_Alunos"
    ON ("Grupos_Alunos.FK_grupo" = "Grupos"."ID_grupo")
    WHERE "Missoes.ID_missao" = ${id_missao} AND "Grupos_Alunos.FK_aluno" = ${id_aluno}
  `;
  console.log( 343 )
  console.log( query )
  const { rows } = await db.query(query);
  console.log( rows )
  return !!rows.length;
};

module.exports = {
  isMissaoEmGrupo,
  hasGrupo,
  isDeletaGrupo,
};
