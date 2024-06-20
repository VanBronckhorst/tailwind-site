var ProgressBar = function(txtStart,txtEnd,where){
	this.startLabel = txtStart;
	this.endLabel = txtEnd;
	var labW=30;
	var barW=100;
	this.svgW = labW + barW + labW;
	this.svgH= 10;
	this.svg = where.append("svg").style("height","100%")
											.style("width","100%")
											.attr("viewBox","0 0 "+this.svgW+" "+this.svgH);
	this.progress = 0.0;
	this.start = this.svg.append("text").text(this.startLabel).attr("x",labW).attr("y",0).attr("height",this.svgH)
						.attr("width",labW).attr("dominant-baseline","hanging").attr("class","time-bar-control-text").attr("text-anchor","end")
						
	this.end = this.svg.append("text").text(this.endLabel).attr("x",labW*2 + barW).attr("y",0)
						.attr("height",this.svgH).attr("width",labW).attr("dominant-baseline","hanging").attr("class","time-bar-control-text").attr("text-anchor","end")
						
	this.progressFrame =this.svg.append("rect").attr("x",labW ).attr("y",0).attr("height",this.svgH).attr("width",barW).attr("fill","white").attr("stroke","black")
	this.progressBar =this.svg.append("rect").attr("x",labW )
						.attr("y",0).attr("height",this.svgH).attr("width",barW*this.progress)
						.attr("fill","yellow").attr("stroke","black")
	
	this.updateProgress = function(progress) {
		this.progress = progress;
		this.progressBar.attr("width",barW*this.progress)
		
	}
	
	this.changeLabels = function(s,e){
		this.start.text(s);
		this.end.text(e);
	}
}