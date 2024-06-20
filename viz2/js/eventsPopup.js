function eventsPopup(){
	this.popup = d3.select("body").append("div")
					.style("visibility","hidden")
					.attr("class","eventPopup")
				    
				    .style("position","absolute")
				    .style("left","0px").style("top","0px")
				    .style("width",d3.select("body").style("width")*0.1)
				    .style("height",d3.select("body").style("height")*0.1)
				    .style("z-index","100")
	
	$(document).mouseup(function (e)
	{
	    d3.selectAll(".eventPopup").style("visibility","hidden");
	});
	
	this.show = function(x,y){
		this.popup.style("visibility","visible").style("left",(parseFloat(x)+10)+"px").style("top",(parseFloat(y)+10)+"px");
		
	}
	
	this.update = function(name){
		this.popup.selectAll("*").remove();
		this.popup.append("h2").text(name);
	}

}