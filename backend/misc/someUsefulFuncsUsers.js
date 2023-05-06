const user_type_code = {
  Admin: 0,
  Aluno: 1,
  Professor: 2,
};

const user_type_code_reverse = Object.fromEntries( Object.entries( user_type_code ).map( x => x.reverse() ) );

async function tryToRegisterOrGetUser(userType, googleData, DAO) {

  try {
    let user = await DAO.busca(googleData.ID_google);

    if (!user) {
      user = await DAO.insere(googleData);
    }
    console.log(user);
    user.row.type = user_type_code[userType] || null;

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
  user_type_code,
  user_type_code_reverse,
};
