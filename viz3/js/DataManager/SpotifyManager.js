var SpotifyManager = function () {

	this.host = 'api.spotify.com';

	this.api_path = "/v1/";

};

// Retrieves artist profile from id
SpotifyManager.prototype.completeProfileFromId = function ( id ) {

	var url = 'https://';
		url += this.host;
		url += this.api_path;
		url += 'artists/';
		url += id;

	return httpGet( url );
};

// Retrieves all album ids for given artist 
SpotifyManager.prototype.albumIdsFromId = function ( id ) {

	var url = 'https://';
		url += this.host;
		url += this.api_path;
		url += 'artists/';
		url += id;
		url += '/albums?album_type=album';

	return httpGet( url );
};

// Retrieves complete albums from ids
SpotifyManager.prototype.albumsFromIds = function ( ids ) {

	var url = 'https://';
		url += this.host;
		url += this.api_path;
		url += 'albums/?ids=';
	
	for ( var i in ids ) {
		url += ids[ i ];
		if ( i < ids.length - 1 ) {
			url += ",";
		}
	}

	return httpGet( url );
};


SpotifyManager.prototype.playFromArtist = function ( id ) {
	var url = 'https://';
	url += this.host;
	url += this.api_path;
	url += 'artists/';
	url += id;
	url += "/top-tracks?country=US";

	return httpGet( url );
}

















	/*

	// Returns an Artist object
	this.getArtistFromName = function ( artistName ) {

		var url = 'https://';
		url += this.host;
		url += '/v1/search?q=';
		url += artistName;
		url += '&type=artist';

		var artist = new Artist();

		// Closure to create artist from json_response
		function createArtist ( artist, artistName ) {

			return function unwrapResponse ( json_response ) {

				var artists = json_response.artists.items;
				for ( var i = 0, len =  artists.length; i < len; ++i ) {
					if ( artists[ i ].name.toUpperCase() === artistName.toUpperCase() ) {
						var a = artists[ i ];
						artist.artistName = a.name;
						artist.spotifyID = a.id;
						artist.genres = a.genres;
						artist.spotifyPopularity = a.popularity;
						
						return;
					}
				}
			};
		}

		var artistCreator = createArtist( artist, artistName );

		get( url, artistCreator );

		return artist;
	};

	this.getArtistAlbums = function ( artistID ) {

		var url = 'https://';
		url += this.host;
		url += '/v1/artists/';
		url += artistID;
		url += '/albums?';

		// Closure to create list of albums from json_response
		//function createAlbumsList
		function createAlbums ( albums ) {

			return function unwrapResponse ( json_response ) {

				var albs = json_response.items;
				for ( var i = 0, len = albs.length; ++i ) {
					var album = this.getAlbumFromID( albs[ i ].id );
					albums.push( album );
				}
			}
		}


		var albums = [];

	};

	this.getAlbumFromID = function ( albumID ) {
		
		var url = 'https://';
		url += this.host;
		url += '/v1/albums/';
		url += albumID;

		// Closure to create artist from json_response
		function createAlbum ( album ) {

			return function unwrapResponse ( json_response ) {

				alb.albumName = json_response.name;
				alb.albumType = json_response.album_type;
				alb.releaseYear = json_response.release_date;
				alb.spotifyID = json_response.id;
				alb.genres = json_response.genres;
				alb.spotifyPopularity = json_response.popularity;
				
				return
			};

		var album = new Album();
		
		var albumCreator = createAlbum( album );

		spotifyGet( url, albumCreator );

		return album;
	};

	*/

