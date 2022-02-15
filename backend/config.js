
module.exports = {
    PORT: process.env['PORT'] ? parseInt(process.env['PORT']) : 3000,
    SECRET: process.env['SECRET'] || 'tccGamificacao',
    DB_URL: process.env['DB_URL'] || null,
    DB_NAME: process.env['DB_NAME'] || null,
    DB_PASSWORD: process.env['DB_PASSWORD'] || null,
    DB_IP: process.env['DB_IP'] || null,
}
