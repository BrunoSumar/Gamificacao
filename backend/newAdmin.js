require("dotenv").config({
  path: process.env.NODE_ENV == "dev" ? ".env.development" : ".env",
});

const bcrypt = require("bcryptjs");
const pg = require("./banco");
const config = require('./config');

const db = new pg.Client({
    user: config.DB_NAME,
    host: config.DB_IP,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: '5432',
});

const [ , , user, password ] = process.argv ;

async function main( db, user, password ){
  if( !db || !user || !password )
    throw 'Comando inválido. Formato esperado: npm run newAdmin USER PASSWORD';

  const text = `
    INSERT INTO "Administrador" ( "TXT_USER", "TXT_HASH_PASSWORD" )
    VALUES ( $1, $2 )
  `;

  const values = [ user, bcrypt.hashSync(password) ];

  try{
    await db.connect();
    await db.query({ text, values });
    console.log( "Administrador cadastrado" );
  }
  catch( err ){
    console.error( err );
  }
  finally{
    await db.end()
  }
}


main( db, user, password );
