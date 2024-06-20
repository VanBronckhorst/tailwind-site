var EchoNestManager = function () {

	this.api_key = 'QVJX27LZP1Q9GYBYV';

	this.host = 'developer.echonest.com';

    this.api_path = '/api/v4/';
    
};

// Builds a query from params
EchoNestManager.prototype.queryString = function ( params ) {

    var query = '?', first = true;
    var value;

    function each ( obj, func ) {
        var key;
        for ( key in obj ) {
            if ( obj.hasOwnProperty( key ) ) {
                func.call( obj, key );
            }
        }
    };

    function isArray ( obj ) {
        return Object.prototype.toString.apply( obj ) === '[object Array]';
    };

    each( params, function ( key ) {
        // only prepend `&` when this
        // isn't the first k/v pair
        if ( first ) {
            first = false;
        } else {
            query += '&';
        }
        value = params[ key ];
        if ( isArray( value ) ) {
            for ( var i = 0, len = value.length; i < len; ++i ) {
                query += ( encodeURI( key ) + '=' + encodeURI( value[ i ] ) );
                if ( i <  len - 1 ) {
                    query += '&';
                }
            }
        } else {
            query += ( encodeURI( key ) + '=' + encodeURI( value ) );
        }
    } );

    return query;
};

// Prepares URL from given parameters
EchoNestManager.prototype.prepareURL = function ( category, method, query ) {

    query.api_key = this.api_key;
    query.format = 'json';
    var url = 'http://';
    url += this.host;
    url += this.api_path;
    url += category + '/';
    url += method;
    url += this.queryString( query );

    return url;
};  

EchoNestManager.prototype.suggestArtist = function ( s, callback, n ) {

    httpGet( this.prepareURL( 'artist', 'suggest', { name: s, results: n ? n : 5 } ) )
    .then( function ( d ) {
        callback( null, d );
    } )
    .catch( function ( e ) {
        callback( e );
    } );
};

EchoNestManager.prototype.suggestGenre = function ( s, callback, n ) {
    httpGet( this.prepareURL( 'genre', 'search', { name: s, results: n ? n : 5 } ) )
    .then( function ( d ) {
        callback( null, d );
    } )
    .catch( function ( e ) {
        callback( e );
    } );
};

EchoNestManager.prototype.completeProfileFromId = function ( id ) {

    var bucket = [ 'genre', 'artist_location', 'terms', 'id:spotify' ];
    
    return httpGet( this.prepareURL( 'artist', 'profile', { id: id, bucket: bucket } ) );  
};

EchoNestManager.prototype.bestArtistsFromGenre = function ( genre ) {

    var bucket = [ 'genre', 'artist_location', 'terms', 'id:spotify' ];

    return httpGet( this.prepareURL( 'genre', 'artists', { name: genre, bucket: bucket,results:10 } ) );
};

EchoNestManager.prototype.similarArtists = function ( id, callback ) {

    httpGet( this.prepareURL( 'artist', 'similar', { id: id } ) )
    .then( function (d) {
        callback( null, d);
    } )
    .catch( function( e ) {
        callback( e );
    } );
};

