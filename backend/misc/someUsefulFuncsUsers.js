async function tryToRegisterOrGetUser(userType, googleData, DAO) {
  const obj_type = {
    Aluno: 1,
    Professor: 2,
    Admin: 0,
  };

  try {
    let user = await DAO.busca(googleData.ID_google);

    if (!user) {
      user = await DAO.insere(googleData);
    }

    console.log(user);
    user.row.type = obj_type[userType] || null;

    if (!user?.row.type) {
      throw error;
    }

    return {
      err: false,
      user: user.row,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  tryToRegisterOrGetUser,
};
