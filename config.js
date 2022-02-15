
module.exports = {
    PORT: process.env['PORT'] ? parseInt(process.env['PORT']) : 3000,
    SECRET: process.env['SECRET'] || 'tccGamificacao',
}
