module.exports = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  SECRET: process.env.SECRET || null,
  DB_URL: process.env.DB_URL || null,
  DB_NAME: process.env.DB_NAME || null,
  DB_PASSWORD: process.env.DB_PASSWORD || null,
  DB_IP: process.env.DB_IP || null,
  DEV_MODE: process.env.NODE_ENV == 'dev' || false,
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || null,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || null,
};
