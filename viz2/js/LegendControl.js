var LegendControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    initialize: function (colors,labels,options /*{ data: {...}  }*/) {
    // constructor
    this.colors= colors;
	this.labels = labels;
    L.Util.setOptions(this, options);
	},

    onAdd: function (map) {
        // create the control container with a particular class name
        this.onMap=true;
        var container = L.DomUtil.create('div', 'date-control');
/*
        
        this.w= parseInt(d3.select("body").style("width"))*0.05+"px";
		this.h= parseInt(this.w)*2 + "px";
		
*/
		this.h= parseInt(d3.select("body").style("height"))*0.18+"px";
		this.w= parseInt(this.h)/1.3 + "px";
		
		this.div = d3.select(container);
		this.div.style("width",this.w).style("height",this.h);
		
		this.svgH = 170;
		this.svgW = 140;
		this.svg = this.div.append("svg").attr("id","legendControlSVG").attr("class","legend-control-svg control-svg").attr("viewBox","0 0 "+ this.svgW+" "+this.svgH).attr("preserveAspectRatio","xMidYMid meet").style("font-size","130%");
		
		//this.updateLegend();
		
        return container;
    },
    onRemove: function(){
	  this.onMap=false;  
    },
    updateLegend: function(){
	    this.svg.selectAll("*").remove();
	    
	    var nRows = this.colors.length+1;
	    var nCols = 3;
	    var padding = 4
	    
	    
	    var rowH = (this.svgH - padding * (nRows + 1)) / (nRows);
	    var colW = (this.svgW - padding * (nCols + 1)) / (nCols);
	    
	    this.svg.append("text").attr("x",this.svgW/2).attr("y",padding+rowH/2).attr("width",this.svgW - padding*2).attr("height", rowH/2).text(this.title).attr("dominant-baseline","middle").attr("text-anchor","middle").style("font-size","130%").style("font-weight","bold");
	    
	    for(var c in this.colors){
		    var color = this.colors[c];
		    var label = this.labels[c];
		    
		    var y = (c)*(rowH+padding)+(rowH+padding);
		    var colX = padding;
		    var labX = padding*2 + colW;
		    var labW = colW * 2 + padding;
		    
		    this.svg.append("rect").attr("fill",color).attr("stroke","black").attr("x",colX).attr("y",y).attr("width",colW).attr("height", rowH);
		    this.svg.append("text").attr("x",labX).attr("y",y+rowH/2).attr("width",labW).attr("height", rowH/2).text(label).attr("dominant-baseline","middle");
	    }
	    
	    
	    
	    
    },
    isOnMap: function(){
	    return this.onMap;
    },
    changeLegend: function(colors,labels,title){
	    this.colors= colors;
		this.labels = labels;
		this.title = title
	    this.updateLegend();
    }
});