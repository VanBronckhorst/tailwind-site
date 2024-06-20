var ArtistMap = function (where,type){
	var that=this;
	this.type = type;

	//INIT SECTION - Initiate the DIV for the map
	this.mapId = "map"+ parseInt(Math.random()*10000);
	this.mapDiv = d3.select(where).append("div").attr("id",this.mapId).attr("class","map-div");
	this.observers = [];
	this.artistMarkers = [];
	// Things highlighted by p1 and p2
	this.highlight={}
	this.highlight[1] = {type:"null"};
	this.highlight[2] = {type:"null"};

	this.addObserver = function(obs){
		this.observers.push(obs);
	}
	//TILES CREATION	

	
 	this. geoTile =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'vanbronckhorst.ncgpejmm',
	    accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
	

	this.tiles = [this.geoTile]
	this.baseMaps = {
    "<g class = 'control-layer-text'>Geo Map</g>": this.geoTile,
	};	
	
	//INITIATE THE MAP	
	this.map = L.map(this.mapId,{layers: [this.geoTile],
								doubleClickZoom: false,
								markerZoomAnimation: false,
								scrollWheelZoom: 'center',
								zoom: 3,
								minZoom: 2,
								maxZoom: 16,
								zoomControl: false
					}).setView([41.88, -87.62], 5);
	L.control.layers(this.baseMaps,null,{position:"topleft"}).addTo(this.map);

	this.map.addControl(new L.Control.ZoomMin());
	this.mapDiv.on("click", function() {
											window.dispatchEvent(new Event('resize'));

											})


}

ArtistMap.prototype.addArtist= function(artist,p){
	var alreadyThere = false;
	for (i in this.artistMarkers) {
		var m = this.artistMarkers[i];
		if (m.artist == artist){
			alreadyThere = true;
			m.addPlayer(p);
		}
	}
	if (!alreadyThere) {
		if (artist.location) {
			var location = artist.location["location"];
			var that = this;
			var callback = function (res) {
				var lat = res[0].geometry.location.lat();
				var lon = res[0].geometry.location.lng();
				that.addArtistMarker(artist, lat, lon, p);
			};
			if (artist.location["latlon"]) {
				that.addArtistMarker(artist, artist.location["latlon"]["lat"], artist.location["latlon"]["lon"]), p;
			} else {
				geocodeAddress(location, callback);
			}
		}
	}
}

ArtistMap.prototype.removeArtist= function(id,p){
	for (var i in this.artistMarkers) {
		var m = this.artistMarkers[i];
		if (m.artistId == id) {
			//
			if (m.removePlayer(p)) {
				this.map.removeLayer(m);
				this.artistMarkers.splice(i,1);
			}

		}
	}
}

ArtistMap.prototype.addArtistMarker= function(artist,lat,lon,p){

	var marker	= new ArtistLayer([parseFloat(lat)+Math.random()*0.05-0.025, parseFloat(lon)+Math.random()*0.05-0.025],artist,this.type,p)
	this.artistMarkers.push(marker);
	//marker.options.title = artist.name;
	this.map.addLayer(marker);
	this.map.setView([lat,lon]);
}

ArtistMap.prototype.highlightGenre = function (genre,p) {
	this.highlight[p]={type:"genre",value:genre}
	for (var i in this.artistMarkers) {
		this.artistMarkers[i].highlight([this.highlight[1],this.highlight[2]]);

	}
}

ArtistMap.prototype.highlightArtist = function (id,p) {
	this.highlight[p]={type:"artist",value:id}
	for (var i in this.artistMarkers) {
		this.artistMarkers[i].highlight([this.highlight[1],this.highlight[2]]);
	}
}
ArtistMap.prototype.highlightArtists = function (ids,p) {
	this.highlight[p]={type:"manyArtists",value:ids}
	for (var i in this.artistMarkers) {
		this.artistMarkers[i].highlight([this.highlight[1],this.highlight[2]]);
	}
}

ArtistMap.prototype.removeHighlight = function(p){
	this.highlight[p]= {type:"null"};
	console.log(this.highlight)
	if (this.highlight[1]["type"]=="null" && this.highlight[2]["type"]=="null") {
		console.log(this.highlight[2]["type"])
		for (var i in this.artistMarkers) {
			this.artistMarkers[i].resetHighlight();
		}
	}
}