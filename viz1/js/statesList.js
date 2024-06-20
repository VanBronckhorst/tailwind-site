function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

function StatesList(){
	
	
	this.states = db.stateNames;
	this.n = this.states[3]
	this.categories=[{name:"----US States----",states:[]},{name:"----World Nations----",states:[]}]
	this.display=function (whereToDisplay){
		
		this.gList = d3.select(whereToDisplay).append("svg").attr("class","stateListSVG").attr("height","100%").attr("width","100%").attr("viewBox","0 0 1000 2000").append("g").attr("visibility","visible")
		
		var size = {w : 900, marginRight : 50, h : 1800};

		this.gList
			.append("rect")
			.attr("width",size.w)
			.attr("height",size.h)
			.attr("y",(2000-size.h)/2)
			.attr("x",size.marginRight)
			.attr("rx",20)
			
			.attr("fill" , "#ffffff");

		var names = [];
		var states = [];
		var nations=[];
		for(i = 0; i < this.states.length; i++) {
			if (this.states[i]!="Aggregated"){
				if (contains(db.USStateNames, this.states[i])) {
					states.push(this.states[i])
				}else{
					nations.push(this.states[i])
				}
			}
		}
		states.sort();
		nations.sort();
		this.categories[0]["states"]=states;
		this.categories[1]["states"]=nations;

		var total= this.categories[0]["states"].length + this.categories[1]["states"].length
		var nCols = 2
		var totRows = Math.ceil(total/nCols) + 6
		var aggrRow = 2
		var cspan = Math.floor(size.w / nCols)
		var rspan = Math.floor(size.h / totRows)
		
		for(ind in this.categories){
			c=this.categories[ind]
			
			this.gList
					.datum(c.name)
					.append("text")
					
					.attr("dy",50+(2000-size.h)/2)
					.classed("selected",sel)
					.attr("x", size.marginRight+size.w/2)
					.attr("y", 0 + (rspan*(aggrRow-1.5)) )
					.text(c.name)
					.attr("text-anchor","middle")
					
					.classed("states-list-cat",true)
					
			
			for (n in c["states"]){	
				
				var name = c["states"][n];
				var catRows = Math.ceil(c["states"].length/nCols)
				var column = Math.floor(n/catRows);
				var row = Math.floor(n%catRows)+aggrRow;
				
				var sel = false
				if (name == "Alaska"){sel=true;}
			
			
			
				this.gList
					.datum(name)
					.append("text")
					.attr("dx",30)
					.attr("dy",50+(2000-size.h)/2)
					.classed("selected",sel)
					.attr("x", size.marginRight + column*cspan)
					.attr("y", 0 + (rspan*row) )
					.text((name == "Alaska")?"> "+name.slice(0,16):name.slice(0,16))
					.classed("states-list-us",function(d){if (contains(db.USStateNames,d)){return true} return false})
					.classed("states-list-elem",true)
					.on("click",function(d){
						if (!(d3.select(this).classed("selected"))){
							
							d3.select(this).classed("selected",stateComp.addState(d));
							if(d3.select(this).classed("selected")){
								d3.select(this).text("> "+d3.select(this).text())
							}
						}else{
							stateComp.removeState(d)
							d3.select(this).classed("selected",false);	
							d3.select(this).text(d3.select(this).text().substring(1))
						}
					});
				
		
			}
			aggrRow +=catRows+2
		}
		
		
	};
};