function queryInsert( elements ){
    if( !elements || elements.length < 1 )
        return null;

    const columns = Object
          .keys( elements[0] )
          .map( key => `"${ key.trim() }"` );

    let _i = 1;
    const parameters = elements
          .map( _ => columns.map( _ => `$${_i++}` ) )
          .map( val => `(${ val })` );

    return `(${ columns }) VALUES ${ parameters }`;
};

function queryValues( elements ){
    return elements
        .map( element => Object.values( element ) )
        .reduce( (acc,cur) => acc.concat(cur) );
};

module.exports = {
    queryInsert,
    queryValues,
};
