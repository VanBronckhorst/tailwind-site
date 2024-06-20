// Given a URL sends a XMLHttpRequest and returns a Promise
httpGet = function ( url ) {

    return new Promise( function ( resolve, reject ) {

        var request = new XMLHttpRequest();
        request.open( 'GET', url, true );
        request.onload = function () {
            var sc = Math.floor(this.status / 100);
            if ( sc === 2 || sc === 3 ) {
                var json_response, response;
                
                json_response = JSON.parse( this.responseText );

                // unwrap the response from the outter
                // `response` wrapper
                response = json_response.response || json_response;
                
                resolve( response );
            } else {
                reject( request.status );
            }
        };
        request.onerror = function () {
            // there was an error,
            // just return the `status`
            // as the first paramter
            reject( this.status );
            return;
        };
        // do it
        request.send();
    } );
};