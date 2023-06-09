const fs = require('fs');

function cleanRoutine( pg ){
  const query_delete = `
    DELETE FROM "Conteudos"
    WHERE "ID_conteudo" NOT IN (
      SELECT "FK_conteudo" FROM "Desafios" WHERE "FK_conteudo" IS NOT NULL
        UNION ALL
      SELECT "FK_conteudo" FROM "Respostas" WHERE "FK_conteudo" IS NOT NULL
    )
  `;

  const query_search = `
    SELECT "TXT_path_arquivo" FROM "Conteudos"
  `;

  const regex_conteudo = /^\.\/conteudos\/(.+)$/;
  const formatPaths = rows => rows
        .map( row => row.TXT_path_arquivo )
        .map( path => path.match( regex_conteudo )[1] );

  return async () => {
    await pg.query( query_delete );

    const { rows } = await pg.query( query_search );
    const paths = formatPaths( rows );

    const files = fs.readdirSync('./conteudos');
    const files_map = new Map( Object.entries( paths ).map( x => x.reverse() ) );

    const delete_list = files.filter( f => !files_map.has(f) ).map( f => `./conteudos/${f}`);

    await Promise.all( delete_list.map( f => fs.unlink( f , _ => _ ) ));
  };
};

module.exports = cleanRoutine;
