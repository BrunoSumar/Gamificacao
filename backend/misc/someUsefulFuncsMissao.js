async function isProfessorAventura(db, id_professor, id_aventura) {
  const text = `
    SELECT * FROM "Aventuras"
    WHERE "FK_professor" = $1
    AND "ID_aventura" = $2
  `;
  const values = [ id_professor, id_aventura ];
  let { rows } = await db.query({ text, values });

  return !!rows.length;
};

async function isAlunoAventura(db, id_aluno, id_aventura) {
  const text = `
    SELECT * FROM "Alunos_Aventuras"
    WHERE "FK_aluno" = $1
    AND "FK_aventura" = $2
  `;
  const values = [ id_aluno, id_aventura ];
  let { rows } = await db.query({ text, values });

  return !!rows.length;
};

async function isMissaoAventura(db, id_missao, id_aventura) {
  const text = `
    SELECT 1 FROM "Missoes"
    WHERE "ID_missao" = $1
    AND "FK_aventura" = $2
  `;
  const values = [ id_missao, id_aventura ];
  let { rows } = await db.query({ text, values });

  return !!rows.length;
};

module.exports = {
  isProfessorAventura,
  isAlunoAventura,
  isMissaoAventura,
};
