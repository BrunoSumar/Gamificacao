async function isOpcaoDesafio(db, id_opcao, id_desafio) {
  const text = `
    SELECT 1 FROM "Opcoes"
    WHERE "FK_desafio" = $1
    AND "ID_opcao" = $2
  `;
  const values = [id_desafio, id_opcao];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
}

async function hasResposta(db, id_desafio, id_aluno) {
  const text = `
    SELECT 1 FROM "Respostas"
    WHERE "FK_desafio" = $1
    AND "FK_aluno" = $2
  `;
  const values = [id_desafio, id_aluno];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
}

async function isMissaoAtiva(db, id_missao) {
  const current_date = new Date().toISOString();
  const text = `
    SELECT 1 FROM "Missoes"
    WHERE "ID_missao" = $1
    AND "DT_entrega_maxima" > $2
  `;
  const values = [id_missao, current_date];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
}

function _groupByAluno(array = []) {
  let obj_temp = {};
  array.forEach((element) => {
    if (!obj_temp[element.ID_aluno]) obj_temp[element.ID_aluno] = [];
    obj_temp[element.ID_aluno].push(element);
  });
  console.log(Object.values(obj_temp));
  return Object.values(obj_temp);
}

function _groupByMissao(array = []) {
  let obj_temp = {};
  array.forEach((element) => {
    if (!obj_temp[element.ID_missao]) obj_temp[element.ID_missao] = [];
    obj_temp[element.ID_missao].push(element);
  });

  return {
    id_aluno: array[0]?.ID_aluno || null,
    missoes: Object.values(obj_temp),
  };
}

function _groupByDesafio(array = []) {
  return {
    id_missao: array[0]?.ID_missao || null,
    desafios: array,
  };
}

function _calculaNotasDesafio(array) {
  return array.reduce((acc, item) => {
    if (item.nota_grande_desafio) return acc + item.nota_grande_desafio;
    if (item.resposta_enviada) return acc + (item.resposta_enviada == item.resposta_correta ? 100 : 0);
    return acc + 0
  },0);
}

function _calculaNotasAventura(array) {
  return array.reduce((acc, item) => {
    return acc + item.nota_missao;
  },0);
}

function criaGrupoRespostas(array = []) {
  const array_temp = _groupByAluno(array)
    .map((element) => _groupByMissao(element))
    .map(({ id_aluno, missoes }) => ({
      id_aluno,
      missoes: missoes.map((element) => _groupByDesafio(element)),
    }));

  return array_temp.map((aluno) => {
    let missao_array = aluno.missoes.map(({ id_missao, desafios }) => {
      return {
        id_missao,
        desafios,
        nota_missao:
          (_calculaNotasDesafio(desafios) / desafios.length),
      };
    });

    return {
      ...aluno,
      missoes: missao_array,
      nota_aventura: _calculaNotasAventura(missao_array) / missao_array.length,
    };
  });
}

async function isRespostaDesafio(db, id_resposta, id_desafio) {
  const current_date = new Date().toISOString();
  const text = `
    SELECT 1 FROM "Respotas"
    WHERE "ID_resposta" = $1
    AND "FK_desafio" = $2
  `;
  const values = [id_resposta, id_desafio];
  let { rows } = await db.query({ text, values });
  return !!rows.length;
}

module.exports = {
  isOpcaoDesafio,
  hasResposta,
  isMissaoAtiva,
  criaGrupoRespostas,
  isRespostaDesafio,
};
