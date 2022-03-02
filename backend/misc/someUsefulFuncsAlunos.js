function criaAluno(googleId, FirstName, LastName, Coins = 0) {
  if (!(googleId || FirstName || LastName)) {
    throw {
      err: true,
      msg: "Não foi possivel criar aluno, verifique parametros!",
    };
  }
  return {
    FirstName,
    googleId,
    LastName,
    Coins,
  };
}
async function tryToRegisterOrGetUser(googleData, DAO) {
  try {
    let aluno = await DAO.buscaAluno(googleData.ID_google).row;
    console.log("Buscou "+aluno)
    if (!aluno) {
      aluno = await DAO.insereAluno(googleData).row;
      console.log("Inseriu "+aluno)
    }
    return {
      err: false,
      aluno,
    };
  } catch (error) {
    throw error;
  }
}
module.exports = {
  criaAluno,
  tryToRegisterOrGetUser,
};
