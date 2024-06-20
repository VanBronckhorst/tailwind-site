function barBox{
	
	this.display = function (whereToDisplay){
								var here = d3.select(whereToDisplay)
								this.svg = here.append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 1000 1000")
								
								
		
								}
	
	
	
}