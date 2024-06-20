function Legend(){
  d3.xml("js/legend.svg", "image/svg+xml", function(xml) {
  								d3.select("#legend").node().appendChild(xml.documentElement);
														});
				
	this.changeBarSize = function(x){
			d3.select("#legend-barsize-text").text("Every bar represents "+x+" year")
	}
	
	this.changeBorn = function(x){
		if (x=="Born"){
			d3.select("#legend-highlight-text").text(x+ " people");
			}else{
				d3.select("#legend-highlight-text").text(x+ " people");
			}
	}
}