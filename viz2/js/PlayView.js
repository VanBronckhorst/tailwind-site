var PlayControl = L.Control.extend({
    options: {
        position: 'bottomleft'
    },
    initialize: function (map,options /*{ data: {...}  }*/) {
    // constructor
    
    this.map=map;
    L.Util.setOptions(this, options);
	},

    onAdd: function (map) {
	    var that = this;
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'date-control');
		
		this.div = d3.select(container);
		//Calculating the right size from the body size
		this.w= parseInt(d3.select("body").style("width"))*0.18+"px";
		this.h= parseInt(this.w)/5+"px";
		this.div.style("width",this.w).style("height",this.h);
		
		this.playButton = this.div.append("div")
									.attr("class","play-view-button")
									.on("click",function(){ d3this=d3.select(this);
															if (d3this.attr("class")=="play-view-button"){
														   												that.map.playSelected();
														   												d3this.attr("class","pause-view-button");
														   												return
														   												}
														   	if (d3this.attr("class")=="pause-view-button"){
														   												that.map.pause();
														   												d3this.attr("class","resume-view-button");
														   												return
														   												}	
														   	if (d3this.attr("class")=="resume-view-button"){
														   												that.map.resume();
														   												d3this.attr("class","pause-view-button");
														   												return
														   												}						
														  }
														   );
        this.stopButton = this.div.append("div")
									.attr("class","stop-view-button")
									.on("click",function(){
														   that.playButton.attr("class","play-view-button");
														   that.map.stop()});
			
		this.rwButton = this.div.append("div")
									.attr("class","rw-view-button")
									.on("click",function(){
														   that.map.decreaseSpeed()});
		this.speedSvg = this.div.append("svg")
									.attr("class","speed-view-button")
									.attr("viewBox", "0 0 50 50")
		this.speedSvg.append("circle").attr("cx",25).attr("cy",25).attr("r",22).attr("fill","white");
		this.speedText = this.speedSvg.append("text").attr("dominant-baseline","middle").attr("text-anchor","middle").attr("x",25).attr("y",25).text("12 hr/s");
													   
		this.ffButton = this.div.append("div")
									.attr("class","ff-view-button")
									.on("click",function(){
														   that.map.increaseSpeed()});
														   

        return container;
    },
    
    updateSpeed : function(newSpeed){
	    
	    this.speedText.text(newSpeed>24?newSpeed/24+" d/s" :newSpeed<1?parseInt(newSpeed*60+"")+ " min/s" :newSpeed+" hr/s");
			
    },
    reset: function(){
	    this.playButton.attr("class","play-view-button");
    }
});