var Album = function () {

	this.name;

	this.year;

	this.spotId;
	
	this.popularity;

};

Album.prototype.albumFromSpotifyJSON = function ( json ) {
	
	this.name = json[ 'name' ];
	this.spotId = json[ 'id' ];
	this.year = json[ 'release_date' ].split( '-' )[ 0 ];
	this.popularity = json[ 'popularity' ];
};