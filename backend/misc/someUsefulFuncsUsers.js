const user_type_code = {
  Admin: 0,
  Aluno: 1,
  Professor: 2,
};

const user_type_code_reverse = Object.fromEntries(
  Object.entries(user_type_code).map((x) => x.reverse())
);

async function tryToRegisterOrGetUser(userType, googleData, DAO) {
  try {
    let user = await DAO.readIdGoogle(googleData.ID_google);
    console.log(user)
    if (!user) {
      user = await DAO.create(googleData);
    }

    user.rows.type = user_type_code[userType] || null;

    if (user?.rows.type == null) {
      throw error;
    }

    return {
      err: false,
      user: user.rows,
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
