const { OAuth2Client } = require("google-auth-library");
// should have a client-id
const client = new OAuth2Client(process.env.CLIENT_ID);
//TODO create a service in google
 client.req
async function verify(token) {
  try {
    client.getToken()
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if (payload["hd"] === "id.uff.br") {
      return { dados: payload, err: false, msg: "Usuario autenticado" };
    } else {
      throw {
        msg: 'Você deve usar uma conta "id.uff.br" para continuar ',
      };
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  verify,
};
