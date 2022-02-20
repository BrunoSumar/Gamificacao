const { OAuth2Client } = require("google-auth-library");
// should have a client-id
const client = new OAuth2Client(process.env.CLIENT_ID);
//TODO create a service in google

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    //googleid
    const userid = payload["sub"];
    //verificar se é o iduff
    const domain = payload["hd"];
    console.log({ userid, domain });
  } catch (error) {
    throw {
      err: error,
      msg: error.msg || "Não foi possivel verificar usuario tente novamente!",
    };
  }
}
