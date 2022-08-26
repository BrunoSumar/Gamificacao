const AlunoDAO = require("../DAO/AlunoDAO");
const ProfessorDAO = require("../DAO/ProfessorDAO");
const { post: SchemaLoginPost } = require("../schemas/login");
const {
  verify: verifyAccessTokenGoogle,
} = require("../misc/someUsefulFuncsGoogleAuth");

const { tryToRegisterOrGetUser } = require("../misc/someUsefulFuncsAlunos"); 

module.exports = async function routes(fastify) {
  fastify.post("/aluno", { schema: SchemaLoginPost }, async (req, reply) => {
    try{
      const alunoDao = new AlunoDAO(fastify.pg);
      const { access_token: id_token } = JSON.parse(req.body);
      let userGoogleData = await verifyAccessTokenGoogle(token);
      let user = await tryToRegisterOrGetUser('Aluno',buildUserPayload('Aluno',userGoogleData.dados),alunoDao);
      user.row.id_token = id_token;
      const token = fastify.jwt.sign(user.row);
      return { token };
    }
    catch (error) {
      console.log(error)
      reply.code(401)
      return {
        err: error,
        msg: "Não Foi possivel criar ou logar nesse usuario, tente novamente em alguns segundos",
      };
  }
  });

  fastify.post("/professor", { schema: SchemaLoginPost }, async (req, reply) => {
    try{
      const professorDAO = new ProfessorDAO(fastify.pg);
      const { access_token: id_token } = JSON.parse(req.body);
      let userGoogleData = await verifyAccessTokenGoogle(token);
      let user = await tryToRegisterOrGetUser('Professor',buildUserPayload('Professor',userGoogleData.dados),professorDAO);
      user.row.id_token = id_token;
      const token = fastify.jwt.sign(user.row);
      return { token };
    }
    catch (error) {
      console.log(error)
      reply.code(401)
      return {
        err: error,
        msg: "Não Foi possivel criar ou logar nesse usuario, tente novamente em alguns segundos",
      };
  }
  });
};


function buildUserPayload(userType,googleData){
  if(userType == 'Aluno'){
    return {
      ID_google: `${googleData.id}`,
      first_name: `${googleData.given_name}`,
      last_name: `${googleData.family_name}`,
      coins: 0,
    }
  }
  if(userType == 'Professor'){
    return {
      ID_google: `${googleData.id}`,
      TXT_primeiro_nome: `${googleData.given_name}`,
      TXT_ultimo_nome: `${googleData.family_name}`,
      FL_validado: false,
    }
  }
}