var defaultLocation = {
	"city": null,
    "country": null,
    "location": "Easter Island",
    "region": null
};

var Artist = function () {

	this.name;

	this.id;

	this.spotId;
	
	this.genres;

	this.popularity;

	this.albums = [];

	this.images;

	this.terms;

	this.location;

	this.popularityOverTime;

	this.minActivityYear;

	this.maxActivityYear;

};

Artist.prototype.artistFromEchoJSON = function ( json ) {

	var art = json[ 'artist' ];

	this.name = art[ 'name' ];
	this.id = art[ 'id' ];
	this.spotId = art[ 'foreign_ids'] ? art[ 'foreign_ids' ][ 0 ][ 'foreign_id' ].split( ':' )[2] : null;
	this.genres = art[ 'genres' ];
	this.location = art[ 'artist_location' ] ? art[ 'artist_location' ] : defaultLocation;
	this.terms = art[ 'terms' ];
};

Artist.prototype.artistFromSpotifyJSON = function ( json ) {

	this.images = json[ "images" ];
};

Artist.prototype.albumsFromSpotifyJSON = function ( json ) {

	var albumPerYear = {};

	for ( var a in json[ 'albums' ] ) {
		var album = new Album();
		album.albumFromSpotifyJSON( json[ 'albums' ][ a ] );

		// Add only the more popular album for year
		if ( !albumPerYear[ album.year ] || album.popularity > albumPerYear[ album.year ].popularity ) {
			albumPerYear[ album.year ] = album;
		}
	}

	for ( var k in albumPerYear ) {
		this.albums.push( albumPerYear[ k ] );
	}
	

};

Artist.prototype.getPopularityOverTime = function () {
	
	if ( this.popularityOverTime ) {
		return this.popularityOverTime;
	}
	return this.popularityOverTime = this.computePopularity();
};

Artist.prototype.computePopularity = function () {
	


	var startingYear = 1940;
	var currentYear = 2015;

	var top = startingYear;
	var bot = currentYear;

	var popularity = [];
	var yearToPop = {};


	function weight( x ) {
		if ( x > currentYear ) {
			x = currentYear;
		}
		// Linear weight, to enhance older artists:
		// when x = currentYear y = 1
		// when x = startingYear y = 10
		var m = ( 1 - 5 ) / ( currentYear - startingYear );
		return m * ( x - currentYear ) + 1;
	}


	function smooth ( x ) {
		var sdsq = .5;
		// Change smoothing function for different shapes
		return Math.exp( -x * x / sdsq );
		// return Math.pow( x, alpha ) * Math.exp( -x * beta );
	}


	if ( allArtistsStatic[ this.name ] ) {
		// Static data available
		var staticData = allArtistsStatic[ this.name ];

		for ( var i in staticData ) {
			yearToPop[ staticData[ i ][ "year" ] ] = staticData[ i ][ "value" ]
			if ( +staticData[ i ][ "year" ] > top ) {
				top = +staticData[ i ][ "year" ];
			}
			if ( +staticData[ i ][ "year" ] < bot ) {
				bot = +staticData[ i ][ "year" ];
			}
		}

	} else {

	
		for ( var i = 0, len = this.albums.length; i < len; ++i ) {
			yearToPop[ this.albums[ i ].year ] = this.albums[ i ].popularity;
			if ( this.albums[ i ].year > top ) {
				top = this.albums[ i ].year;
			}
			if ( this.albums[ i ].year < bot ) {
				bot = this.albums[ i ].year;
			}
		}

	}
	// Smooth popularity
	var smoothedPopularity = {};
	for ( var i = startingYear; i <= currentYear; ++i  ) {
		smoothedPopularity[ i ] = 0;
		for ( var j = startingYear; j <= currentYear; ++j ) {
			smoothedPopularity[ i ] += ( yearToPop[ j ] || 0 ) * smooth( i - j );
		}
		// Weight popularity
		//smoothedPopularity[ i ] *= weight( i );
	}
	// Format popularity
	for ( var i = startingYear; i <= currentYear; ++i) {
		popularity.push( { "name": this.name, "date": i.toString(), "value": smoothedPopularity[ i ] || 0 } );
	}
	// Set min and max activity year
	var delta = 3;
	bot = +bot;
	top = +top;
	this.minActivityYear = _.max( [ bot - delta, startingYear ] );
	this.maxActivityYear = _.min( [ top + delta, currentYear ]  );

	return popularity;
	
};