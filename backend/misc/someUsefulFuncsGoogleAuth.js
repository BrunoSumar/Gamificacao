const { OAuth2Client } = require("google-auth-library");
// should have a client-id
const fetch = require("node-fetch");
//TODO Fazer chamada com o access token nesse link https://www.googleapis.com/oauth2/v1/userinfo

async function verify(token) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const payload = await response.json();
    // if (payload["hd"] !== "id.uff.br") {
    //   throw {
    //     msg: 'Você deve usar uma conta "id.uff.br" para continuar ',
    //   };
    // }
    console.log(payload);
    return { dados: payload, err: false, msg: "Usuario autenticado" };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  verify,
};
