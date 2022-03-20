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
    let aluno = await DAO.buscaAluno(googleData.ID_google);
    console.log("Buscou: ")
    console.log(aluno)
    if (!aluno) {
      aluno = await DAO.insereAluno(googleData);
      console.log("inseriu: ")
      console.log(aluno)
    }
    aluno.row.tipo = 1; // tipo dele é aluno
    console.log( 'aluno: ', aluno )
    // TODO: pensar numa maneira melhor de diferenciar o tipo do usuário pelo toke
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
