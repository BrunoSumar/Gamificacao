async function isOpcaoDesafio(db, id_opcao, id_desafio) {
  const text = `
    SELECT 1 FROM "Opcoes"
    WHERE "FK_desafio" = $1
    AND "ID_opcao" = $2
  `;
  const values = [ id_desafio, id_opcao ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

async function hasResposta(db, id_desafio, id_aluno) {
  const text = `
    SELECT 1 FROM "Respostas"
    WHERE "FK_desafio" = $1
    AND "FK_aluno" = $2
  `;
  const values = [ id_desafio, id_aluno ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

async function isMissaoAtiva(db, id_missao) {
  const current_date = new Date().toISOString();
  const text = `
    SELECT 1 FROM "Missoes"
    WHERE "ID_missao" = $1
    AND "DT_entrega_maxima" > $2
  `;
  const values = [ id_missao, current_date ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

async function isRespostaDesafio(db, id_resposta, id_desafio) {
  const current_date = new Date().toISOString();
  const text = `
    SELECT 1 FROM "Respotas"
    WHERE "ID_resposta" = $1
    AND "FK_desafio" = $2
  `;
  const values = [ id_resposta, id_desafio ];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
};

module.exports = {
  isOpcaoDesafio,
  hasResposta,
  isMissaoAtiva,
  isRespostaDesafio,
};
