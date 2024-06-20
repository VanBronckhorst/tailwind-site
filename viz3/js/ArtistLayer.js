function isIn(s,array) {
    for (var i in array) {
        if (s==array[i]){
            return true;
        }
    }
    return false;
}

var ArtistLayer = L.Class.extend({

    initialize: function (latlng,artist,t,p) {
        // save position of the layer or any options from the constructor
        this._latlng = latlng;
        this.artistId = artist.id;
        this.artist = artist;
        this.type = t;
        this.player = p==2?2:1;
        this.shared = false;
    },

    onAdd: function (map) {
        this._map = map;
        if (!globalPopup) {
            globalPopup = new artistPopup();
        }

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
        map.getPanes().markerPane.appendChild(this._el);
        this.cont = d3.select(this._el);
        this.svg = d3.select(this._el).append("svg");

        var badLink= "http://userserve-ak.last.fm/";
        var avatar = null;
        for (i in this.artist.images){
            var url = this.artist.images[0]["url"];
            if (url.indexOf(badLink) == -1){
                avatar = url;
                break;
            }
        }
        this.defs = this.svg.append("defs");
        this.defs.append("svg:pattern")
            .attr("id", "map"+this.artistId)

            .attr("width", "100%")
            .attr("height", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("svg:image")
            .attr("xlink:href", avatar?avatar:defaultAvatar)
            .attr("width", 1)
            .attr("height", 1)
            .attr("preserveAspectRatio","none")

        // Find a way to get the size 
        this.svg.style("position","relative").attr("viewBox","0 0 100 100")
        this.goSmall();

        this.defs = this.svg.append("svg:defs");

        var grad = this.defs.append("defs").append("linearGradient").attr("id", "bothMap")
            .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
        grad.append("stop").attr("offset", "50%").style("stop-color", dynamicTimelineColorBlue);
        grad.append("stop").attr("offset", "50%").style("stop-color", dynamicTimelineColorRed);


        // Assign the stroke to be of the color of the genre of the artist
        var stroke = "transparent";
        for (i in this.artist["genres"]) {
            if (colorForGenre[this.artist["genres"][i]["name"].toUpperCase()]) {
                stroke = colorForGenre[this.artist["genres"][i]["name"].toUpperCase()];
                break;
            }
        }

        var artist = this.artist;
		this.circle = this.svg.append("circle").style("fill","url(#map"+this.artistId+")").attr("cx", 50).attr("class","player"+this.player)
            .on("click",function(ev)
                            {
                                globalPopup.update(artist);
                                console.log();
                                globalPopup.show(d3.event.x,d3.event.y );})
        .attr("cy", 50)
        .attr("r", 40)

        if (this.type == "static") {
            this.circle.style("stroke",stroke);
        }

        this.update();
        // add a viewreset event listener for updating layer's position, do the latter
        map.on('zoom viewreset', this.update, this);

    },

    goBig: function(){
      this.svg.style("left","-50px").style("top","-50px").style("width","100px").style("height","100px")
    },
    goSmall: function(){
        this.svg.style("left","-25px").style("top","-25px").style("width","50px").style("height","50px")
    },

    onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().markerPane.removeChild(this._el);
        map.off('zoom viewreset', this.update, this);
    },

    update: function () {
        // update layer's position
        var pos = this._map.latLngToLayerPoint(this._latlng);
        if(this._map._zoom >6) {
            this.goBig();
        }else{
            this.goSmall();
        }
        L.DomUtil.setPosition(this._el, pos);
    },

    highlight: function(toHighlight) {
        var should=false;
        for (var i in toHighlight) {
            var t= toHighlight[i];
            if (t["type"]=="genre") {
                for (var j in this.artist["genres"]) {
                    if (this.artist["genres"][j]["name"].toUpperCase() == t["value"].toUpperCase()) {
                        should = true;
                        break;
                    }
                }
            }
            if (t["type"]== "artist") {
                if (this.artist["name"]==t["value"]) {
                    should=true
                }
            }
            if (t["type"]== "manyArtists") {
                if (isIn(this.artist["name"],t["value"])) {
                    should=true
                }
            }
        }

        this.cont.style("opacity",should?1:0.1);
        this.cont.style("z-index",should?2:1);

    },
    resetHighlight: function() {
        this.cont.style("opacity",1);
        this.cont.style("z-index",1);
    },
    addPlayer : function(p) {

        if (this.player != p) {
            this.shared = true;
            this.circle.style("stroke","url(#bothMap)");
        }

    },
    removePlayer : function(p) {
        if (this.shared) {
            this.shared = false;
            this.player = p==2 ? 1:2;
            this.circle.style("stroke",null).attr("class","player"+this.player);
            return false;
        }else {
            return true;
        }
    }
});

function artistPopup(){
    this.popup = d3.select("body").append("div")
        .style("visibility","hidden")
        .attr("class","eventPopup")

        .style("position","absolute")
        .style("left","0px").style("top","0px")
        .style("width",parseFloat(d3.select("body").style("width"))*0.2)
        .style("height",parseFloat(d3.select("body").style("height"))*0.4)
        .style("z-index","1002")

 /*   $(document).mouseup(function (e)
    {
        d3.selectAll(".eventPopup").style("visibility","hidden");
    });
*/
    d3.select("body").on("click",function () { d3.selectAll(".eventPopup").style("visibility","hidden");});

    this.show = function(x,y){
        y = (parseFloat(y)+10);
        totH = parseFloat(d3.select("body").style("height"));
        var toChange = y>totH/2?"bottom":"top";
        var toAuto = y>totH/2?"top":"bottom";
        y = toChange=="bottom"?totH-y:y
        this.popup.style("visibility","visible").style("left",(parseFloat(x)+10)+"px")
            .style(toChange,y+"px")
            .style(toAuto,"auto");
        d3.event.stopPropagation();

    }

    this.update = function(artist){
        this.popup.selectAll("*").remove();
        this.popup.append("div").attr("class","popup-title").text(artist["name"]);
        this.popup.append("div").attr("class","popup-image").append("img").attr("src",artist.images[0]["url"]);
        this.popup.append("div").attr("class","popup-genres-title").text("Genres:")
        var list = this.popup.append("div").attr("class","popup-genres-div")
        for (i in artist["genres"]) {
            list.append("p").text(artist["genres"][i]["name"].capitalize())
        }
        var that=this;
        dm.playSomething(artist["id"],function(song) {
            that.popup.append("div").attr("class","popup-playing-title").text("Playing:")
            that.popup.append("div").attr("class","popup-playing-div").text(song["name"])
        })
    }

}

String.prototype.capitalize = function(){
    return this.toLowerCase().replace( /\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

var globalPopup = null;