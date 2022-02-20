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

module.exports = {
    criaAluno
}
