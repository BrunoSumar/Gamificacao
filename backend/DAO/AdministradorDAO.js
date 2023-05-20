const bcrypt = require("bcryptjs");
const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

const { isAdminUnique } = require("../misc/someUsefulFuncsAdmin");
class AdministradorDAO {
  constructor(db) {
    this._db = db;
  }

  async create({ user, password }) {
 
    if (!regexp.test(password)) {
      throw "A senha precisa conter: Pelo menos uma letra minúscula, Pelo menos uma letra maiúscula, Pelo menos um dígito, Pelo menos um caractere especial de (@$!%*?&), Comprimento mínimo de 8 caracteres e Comprimento Máximo de 30 caracteres ";
    }
    console.log('foi')
    if (!isAdminUnique(this._db,user)) {
      throw "Já existe um usuario com esse nome cadastrado";
    }
    const passwordHash = bcrypt.hashSync(password);
    const query = {
      text: `INSERT INTO "Administrador" ("TXT_USER","TXT_HASH_PASSWORD")
      VALUES ($1,$2)
      RETURNING "ID_Administrador", "TXT_USER"`,
      values: [user, passwordHash],
    };

    try {
      const { rows } = await this._db.query(query);
      return {
        admin: { ...rows[0], type: 0 },
        message: `Usuario: ${user} criado com sucesso.`,
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel adicionar esse administrador";
    }
  }

  async readByPassword({ user, password }) {
    const query = {
      text: `SELECT * FROM "Administrador" WHERE "TXT_USER" = $1 `,
      values: [user],
    };

    try {
      const { rows } = await this._db.query(query);
      if (rows.length < 1) {
        throw "Esse Usuario não existe";
      }
      console.log(rows);
      if (!bcrypt.compareSync(password, rows[0].TXT_HASH_PASSWORD))
        throw "Senha incorreta";
      return {
        admin: rows.map((item) => {
          delete item.TXT_HASH_PASSWORD;
          item.type = 0;
          return item;
        })[0],
        Message: "Usuario logado!",
      };
    } catch (error) {
      console.log(error);
      throw "Não foi possivel obter o usuario";
    }
  }

  async patch({ ID_Administrador, password }) {
    if (!regexp.test(password))
      throw "A senha precisa conter: Pelo menos uma letra minúscula, Pelo menos uma letra maiúscula, Pelo menos um dígito, Pelo menos um caractere especial de (@$!%*?&), Comprimento mínimo de 8 caracteres e Comprimento Máximo de 30 caracteres ";

    const query = {
      text: `UPDATE "Administrador" SET "TXT_HASH_PASSWORD" = $1 WHERE "ID_Administrador" = $2 `,
      values: [bcrypt.hashSync(password), ID_Administrador],
    };
    console.log(query)
    try {
      await this._db.query(query);
      return "Senha alterado com sucesso!";
    } catch (error) {
      console.log(error);
      throw "Não foi possivel alterar senha";
    }
  }
}

module.exports = AdministradorDAO;
