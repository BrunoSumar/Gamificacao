const fs = require('fs');

function cleanRoutine( pg ){
    const query_delete = `
      DELETE FROM "Conteudos"
      WHERE "ID_conteudo" NOT IN (
        SELECT "FK_conteudo" FROM "Desafios"
          UNION ALL
        SELECT "FK_conteudo" FROM "Respostas"
      )
    `;

    const query_search = `SELECT "TXT_path_arquivo" FROM "Conteudos"`;

    const regex_conteudo = /^\.\/conteudos\/(.+)$/;
    const formatPaths = rows => rows
          .map( row => row.TXT_path_arquivo )
          .map( path => path.match( regex_conteudo )[1] );

    return async () => {
        // console.log( 'aaaaaaa' )
        // await pg.query( query_delete );

        const { rows } = await pg.query( query_search );
        const paths = formatPaths( rows );


        const files = fs.readdirSync('./conteudos');

        console.log( paths )
        console.log( files )

    };
};

module.exports = cleanRoutine;
