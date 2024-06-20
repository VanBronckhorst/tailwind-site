var DataManager = function () {

	this.echoNestManager = new EchoNestManager();

	this.spotifyManager = new SpotifyManager();

	this.artistsObservers = [];

	this.genresObservers = [];

	this.chosenArtists = [];

	this.chosenGenres = [];

	this.searchedArtists = {}; // Cache to avoid queries over previously fetched artists

	this.searchedGenres = {};

	this.partialRes = {};

};

// Adds artists observer
DataManager.prototype.addArtistsObserver = function ( obj ) {
	
	console.log( 'Added new artists observer' );
	this.artistsObservers.push( obj );
};

// Adds genres observer
DataManager.prototype.addGenresObserver = function ( obj ) {
	
	console.log( 'Added new genres observer' );
	this.genresObservers.push( obj );
};

// Removes artists observer
DataManager.prototype.removeArtistsObserver = function ( obj ) {
	
	for( var i = 0, len = this.genresObservers.length; i < len; ++i ) {
  		if( this.artistsObservers[ i ] === obj ) {
    		this.artistsObservers.splice( i, 1 );
    		console.log( 'Removed existing artist observer' );
    		return true;
  		}
	}
return false;
};

// Removes genres observer
DataManager.prototype.removeGenresObserver = function ( obj ) {
	
	for( var i = 0, len = this.genresObservers.length; i < len; ++i ) {
  		if( this.genresObservers[ i ] === obj ) {
    		this.genresObservers.splice( i, 1 );
    		console.log( 'Removed existing genres observer' );
    		return true;
  		}
	}
return false;
};

// Retrieves the complete artist profile (including albums) 
DataManager.prototype.artistFromId = function ( id, callback ) {

	if ( this.searchedArtists[ id ] ) {
		console.log( 'Retrieve cached artist' );
		callback( null, this.searchedArtists[ id ] );
		return;
	}

	var artist = new Artist();

	var that = this;

	this.echoNestManager.completeProfileFromId( id )
	.then( function ( json ) { 
		artist.artistFromEchoJSON( json );

		that.spotifyManager.completeProfileFromId( artist.spotId )
		.then( function ( json ) { artist.artistFromSpotifyJSON( json ); } );

		that.spotifyManager.albumIdsFromId( artist.spotId )
		.then( function ( json ) {

			var albumIds = [];
			for ( var i = 0, len = json[ 'items' ].length; i < len; ++i) {

				albumIds.push( json[ 'items' ][ i ][ 'id' ] ); 
			}
			if ( albumIds.length != 0 ) {
				that.spotifyManager.albumsFromIds( albumIds )
				.then( function ( json ) { 
					artist.albumsFromSpotifyJSON( json );
					that.chosenArtists.push( artist );
					// Cache artist
					that.searchedArtists[ artist.id ] = artist;
					callback( null, artist ); 
				} );
			} else {
				that.chosenArtists.push( artist );
				// Cache artist
				that.searchedArtists[ artist.id ] = artist;
				callback( null, artist ); 
			}
		} )
		.catch( function ( err ) {
			that.chosenArtists.push( artist );
			// Cache artist
			that.searchedArtists[ artist.id ] = artist;
			callback( null, artist );
		} );
	} );
};

DataManager.prototype.bestArtists = function (g,callback) {
	g = g.toLowerCase();
	if ( this.searchedGenres[ g ] ) {
		console.log( 'Retrieve cached artist' );
		callback( null, this.searchedGenres[ g ] );
		return;
	}

	var artists = [];
	for (var i=0;i<10;i++) {
		artists[i]=new Artist();
	}
	this.partialRes[g] = {call:callback,res:[]};
	var that = this;

	this.echoNestManager.bestArtistsFromGenre( g)
			.then( function ( json ) {
				that.chosenGenres.push(g);
				var artistsj = json["artists"];


				for (var iii in artists) {
					// Create scope for dealing with callback in for loop
					(function (varA,varB){
						varA.artistFromEchoJSON({artist:varB});

					that.spotifyManager.completeProfileFromId(artists[iii].spotId)
							.then(function (json) {
								varA.artistFromSpotifyJSON(json);
							});

					that.spotifyManager.albumIdsFromId(varA.spotId)
							.then(function (json) {

								var albumIds = [];
								for (var i = 0, len = json['items'].length; i < len; ++i) {

									albumIds.push(json['items'][i]['id']);
								}
								if (albumIds.length != 0) {
									that.spotifyManager.albumsFromIds(albumIds)
											.then(function (json) {
												varA.albumsFromSpotifyJSON(json);
												//that.chosenArtists.push(artist);
												// Cache artist

												that.addRes(g,varA)
											});
								} else {
									that.addRes(g,varA)
								}
							})
							.catch(function (err) {
								that.addRes(g,varA)
							});
				})(artists[iii],artistsj[iii])
				}
			} );
}

DataManager.prototype.addRes = function(g,a) {
	this.partialRes[g]["res"].push(a);
	if (this.partialRes[g]["res"].length == 10) {
		console.log(this.partialRes[g]["res"]);
		this.partialRes[g]["call"](null,this.partialRes[g]["res"])
		this.searchedGenres[g] = this.partialRes[g]["res"];
	}
}

DataManager.prototype.suggestArtist = function ( s, callback, n ) {

    this.echoNestManager.suggestArtist( s, callback, n );
};

DataManager.prototype.suggestGenre = function ( s, callback, n ) {
	this.echoNestManager.suggestGenre( s, callback, n );
}



DataManager.prototype.similarArtists = function ( artistsId, callback) {
    
    this.echoNestManager.similarArtists( artistsId, callback );
};

DataManager.prototype.playSomething = function(artistId,callback) {
	var artist = new Artist();

	var that = this;

	this.echoNestManager.completeProfileFromId( artistId )
			.then( function ( json ) {
				artist.artistFromEchoJSON( json );

				that.spotifyManager.playFromArtist( artist.spotId )
						.then( function ( json ) {
							if (json["tracks"].length > 0) {
								window.Player.playForTrack(json["tracks"][0]);
								callback(json["tracks"][0]);
							}
						} );
	});
}