/**
 * Created by Filippo on 08/11/15.
 */

var SuggestionList = function (where) {
    this.container = d3.select(where);
    this.listBox = this.container.append("div").attr("class","suggested-list-box");
    this.nRows = 8;
    this.nCols = 1;
    this.artistsSelected = [];
    this.artistsSuggested = [];
    this._onClick = function(){};
    this.dm = new DataManager();

}

SuggestionList.prototype.onClick = function(fun) {
    this._onClick=fun;
    return this;
}

SuggestionList.prototype.display = function() {
    this.listBox.selectAll("*").remove();
    var that = this
    for (var i in this.artistsSuggested) {
        var a = this.artistsSuggested[i];
        var el = this.listBox.append("div").attr("class","suggested-list-element")
        el.datum(a)

        el.on("click", function(d){
            that._onClick(d);
        });
        var newEl = new SuggestElement(el,a)
        var r = i
        var top = (r * (100/ this.nRows)) +"%";
        var h = (100/ this.nRows) +"%";
        var w = (100/ this.nCols) +"%";
        el.style("top",top).style("height",h).style("width",w)
    }
}


SuggestionList.prototype.update = function() {
    var buck = [];
    // only the last 5 selected artists
    var start = this.artistsSelected.length - 5<0?0: this.artistsSelected.length - 5;
    for (var i=start; i<this.artistsSelected.length; i++) {
        buck.push(this.artistsSelected[i].id);
    }
    var that = this;

    var cb = function (err,data) {
        if (!err) {
            that.artistsSuggested = data["artists"];
            that.display();
        }
    }
    
    this.dm.similarArtists(buck,cb)
    
}

SuggestionList.prototype.removeArtist = function(id) {
    for (var i in this.artistsSelected) {
        var el = this.artistsSelected[i];
        if (el.id == id){

            this.artistsSelected.splice(i,1);
        }
    }
    this.update();
}

SuggestionList.prototype.addArtist = function(artist) {
    this.artistsSelected.push(artist);
    this.update();
}

var SuggestElement = function(d3where,artist) {
    var that=this;
    this.container = d3where;
    var name = artist.name;
    this.artistId = artist.id;
    //this.closeBox = this.container.append("i").attr("class","fa fa-close selected-close-box")
    this.textBox = this.container.append("p").attr("class","fa fa-music suggested-text-box").text(" "+name);

}