
/**
 * Created by Filippo on 07/11/15.
 */

var SelectedList = function (where) {
    this.container = d3.select(where);
    this.listBox = this.container.append("div").attr("class","selected-list-box");
    this.nRows = 10;
    this.nCols = 1;
    this.elems = [];
    this._onClick = function(){};


}

SelectedList.prototype.onClick = function(fun) {
    this._onClick=fun;
    return this;
}

SelectedList.prototype.rearrange = function() {
    for (var i in this.elems){
        var el = this.elems[i];
        var r = i
        var top = (r * (100/ this.nRows)) +"%";
        var h = (100/ this.nRows) +"%";
        var w = (100/ this.nCols) +"%";
        el.style("top",top).style("height",h).style("width",w)
    }
}

SelectedList.prototype.removeArtist = function(data) {
    for (var i in this.elems) {
        var el = this.elems[i];
        if (el.artistId == data.id){
            el.remove();
            this.elems.splice(i,1);
            // callback to observer
            this._onClick(data);

            break;
        }
    }
    this.rearrange();
}

SelectedList.prototype.addArtist = function(artist) {
    var that = this;
    var alreadyThere = false;
    for (var i in this.elems) {
        var el = this.elems[i];
        if (el.artistId == artist["id"]){
            alreadyThere = true;
        }
    }
    if (!alreadyThere) {
        var el = this.listBox.append("div").attr("class","selected-list-element")
        el.artistId = artist.id
        el.data = {type:"artist",value:artist,id:artist.id};
        el.datum(el.data);
        el.on("click",function(d) {that.removeArtist(d);})
        var newEl = new SelectedElement(el,artist,this)
        this.elems.push(el);
        this.rearrange();
    }
}

SelectedList.prototype.addGenre = function(gen) {
    var that = this;
    var alreadyThere = false;
    for (var i in this.elems) {
        var el = this.elems[i];
        if (el.artistId == gen["name"]){
            alreadyThere = true;
        }
    }
    if (!alreadyThere) {
        var el = this.listBox.append("div").attr("class","selected-list-element")
        el.artistId = gen.name;
        el.data = {type:"genre",value:gen,id: gen.name};
        el.datum(el.data);
        el.on("click",function(d) {that.removeArtist(d);})
        var newEl = new SelectedElement(el,gen,this)
        this.elems.push(el);
        this.rearrange();
    }
}



var SelectedElement = function(d3where,artist,list) {
    var that = this;
    this.container = d3where;
    var name = artist.name;
    this.artistId = artist.id;
    //this.closeBox = this.container.append("i").attr("class","fa fa-close selected-close-box")
    this.textBox = this.container.append("p").attr("class", "fa fa-close selected-text-box").text(name)
}
