const pg = require('pg');
const config = require('../config');

module.exports = new pg.Pool({
    user: config.DB_NAME,
    host: config.DB_IP,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: '5432',
    max: 6,
});
