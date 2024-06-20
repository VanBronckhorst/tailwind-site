var ChooseControl = L.Control.extend({
    options: {
        position: 'bottomleft'
    },
    initialize: function (map,options /*{ data: {...}  }*/) {
    // constructor
    this.choiches = ["Compare Speed","Compare Pressure","Only Lines","Cloropleth"];
    this.selected = 0;
    this.map = map;
    this.onMap = false;
    L.Util.setOptions(this, options);
	},

    onAdd: function (map) {
	    this.onMap = true;
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'date-control');
        
        this.w= parseInt(d3.select("body").style("width"))*0.10+"px";
		this.h= parseInt(this.w)/2 + "px";
		
		
		this.div = d3.select(container);
		this.div.style("width",this.w).style("height",this.h);
		
		this.svgH = 60;
		this.svgW = 140;
		this.svg = this.div.append("svg").attr("id","legendControlSVG").attr("class","control-svg").attr("viewBox","0 0 "+ this.svgW+" "+this.svgH).attr("preserveAspectRatio","xMidYMid meet");
		
		//this.updateLegend();
		this.updateView();
        return container;
    },
    onRemove: function(){
	    this.onMap=false;
    },
    updateView: function(){
	    var that=this;
	    this.svg.selectAll("*").remove();
	    
	    var nRows = this.choiches.length;
	    
	    var padding = 4
	    
	    
	    var rowH = (this.svgH - padding * 2) / (nRows);
	    var colW = (this.svgW - padding * 2);
	    
	    for(var c in this.choiches){
		    var choiche = this.choiches[c];
		    
		    var y = (c)*(rowH)+(padding);
		    
		    
		    this.svg.append("rect").attr("fill",c==this.selected?"yellow":"white").attr("stroke","black")
		    						.attr("x",padding).attr("y",y).attr("width",colW).attr("height", rowH)
		    						.datum(c).on("click",function(d){that.changeSelected(d)});
		    this.svg.append("text").attr("x",padding+colW/2).attr("y",y+rowH/2).attr("width",colW)
		    		.attr("height", rowH/2).text(choiche).attr("dominant-baseline","middle").attr("text-anchor","middle")
		    		.datum(c).on("click",function(d){that.changeSelected(d)});
	    }
	    
	    
	    
	    
    },
    changeSelected: function(i){
	    this.selected = i;
	    this.updateView();
	    this.map.changeVisualization(i);
    },
    getSelected: function(){
	    return this.selected;
    },
    isOnMap: function(){
	    return this.onMap;
    }
});