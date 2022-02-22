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
function tryToRegisterOrGetUser(googleData, DAO) {
  //escrever func
  return true;
}
module.exports = {
  criaAluno,
  tryToRegisterOrGetUser,
};
