

/**
 * Created by Filippo on 18/11/15.
 */

var StaticList = function (where) {
    this.container = d3.select(where);
    this.listBox = this.container.append("div").attr("class","selected-list-box");
    this.nRows = 8;
    this.nCols = 1;
    this.elems = [];
    this._onClick = function(){};


}

StaticList.prototype.onClick = function(fun) {
    this._onClick=fun;
    return this;
}

StaticList.prototype.rearrange = function() {
    for (var i in this.elems){
        var el = this.elems[i];
        var r = i
        var top = (r * (100/ this.nRows)) +"%";
        var h = (100/ this.nRows) +"%";
        var w = (100/ this.nCols) +"%";
        el.style("top",top).style("height",h).style("width",w)
    }
}
StaticList.prototype.reset = function() {
    this.elems=[];
    this.listBox.selectAll("*").remove();
    this.rearrange();
}

StaticList.prototype.addGenre = function(genre) {
    var that=this;
    var alreadyThere = false;
    for (var i in this.elems) {
        var el = this.elems[i];
        if (el.name == genre){
            alreadyThere = true;
        }
    }
    if (!alreadyThere) {
        var el = this.listBox.append("div").attr("class","selected-list-element").on("click",function(){that._onClick(genre)});
        el.name = genre;
        var newEl = new StaticGenreElement(el,genre,this)
        this.elems.push(el);
        this.rearrange();
    }
}

StaticList.prototype.addArtist = function(artist) {
    var that=this;
    var alreadyThere = false;
    for (var i in this.elems) {
        var el = this.elems[i];
        if (el.artistId == artist["id"]){
            alreadyThere = true;
        }
    }
    if (!alreadyThere) {
        var el = this.listBox.append("div").attr("class","selected-list-element").on("click",function(){that._onClick(artist["name"])});
        el.artistId = artist.id
        var newEl = new StaticElement(el,artist,this)
        this.elems.push(el);
        this.rearrange();
    }
}

var StaticElement = function(d3where,artist,list) {
    var that=this;
    this.container = d3where;
    var name = artist.name;
    this.artistId = artist.id;
    //this.closeBox = this.container.append("i").attr("class","fa fa-close selected-close-box")
    this.textBox = this.container.append("p").attr("class","fa fa-music selected-text-box").text(name)

}
var StaticGenreElement = function(d3where,genre,list) {
    var that=this;
    this.container = d3where;
    var name = genre;
    this.name = genre;
    //this.closeBox = this.container.append("i").attr("class","fa fa-close selected-close-box")
    this.textBox = this.container.append("p").attr("class","fa fa-music selected-text-box").text(name)

}