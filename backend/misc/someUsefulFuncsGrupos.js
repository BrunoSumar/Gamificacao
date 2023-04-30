async function isMissaoEmGrupo(db, id_missao) {
  const query = `SELECT * from "Missoes" WHERE "ID_missao" = ${id_missao} AND "FL_grupo" = TRUE`;
  const { rows } = db.query(query);
  return rows.length ? true : false;
}

async function isDeletaGrupo(db, id_grupo) {
  const query = `SELECT count(1) as qtd from "Grupos_Alunos" WHERE "FK_grupo" = ${id_grupo};`;
  const { rows } = db.query(query);
  return rows[0].qtd ? false : true;
}

async function hasGrupo(db, id_missao, id_aluno) {
  const query = `
    SELECT * as qtd 
    from "Missoes"
    join "Grupos"
    on "Missoes.ID_missao" = "Grupos.FK_missao"
    join "Grupos_Alunos"
    on "Grupos_Alunos.FK_grupo" = "Grupos.ID_GRUPOS"
    WHERE "MissoesID_missao." = ${id_missao} AND "Grupos_Alunos.FK_aluno" = ${id_aluno} ;`;
  const { rows } = db.query(query);
  return rows.length ? true : false;
}
