async function isProfessorAventura(db, id_professor, id_aventura) {
  const query = `
        select * from "Aventuras" where "FK_professor" = ${id_professor} AND "ID_aventura" = ${id_aventura}
    `;
  let { rows } = await db.query(query);

  return rows.length ? true : false;
}

async function isAlunoAventura(db, id_aluno, id_aventura) {
    const query = `
          select * from "Alunos_Aventuras" where "FK_aluno" = ${id_aluno} AND "ID_aventura" = ${id_aventura}
      `;
    let { rows } = await db.query(query);
  
    return rows.length ? true : false;
  }

module.exports = {
    isProfessorAventura,
    isAlunoAventura
}
