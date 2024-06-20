function statesCompHor(whereToDisplay){
	var that=this
	this.display = d3.select(whereToDisplay)
	this.compareBoxH = 85
	this.compareBoxW =90
	this.statesDisplayed = [{s:"Alaska",i:0}]
	this.percSelected = true;
	this.buckets = false;
	this.bucketSize = 10;
	this.percentage=true;
	this.useEstimates = false;
	this.dataYear = 2014;
	this.ageCon = 12
	
	
	this.events = [{name:"9/11",year:2001},{name:"Fall of Berlin wall",year:1989},{name:"End of WW2",year:1945},{name:"End of WW1",year:1918},{name:"Man On the Moon",year:1961},{name:"Haiti Tsunami",year:2010},{name:"Chinese Famine",year:1958},{name:"Korean War",year:1950},{name:"Spurs First Ring",year:1999},{name:"JFK Assassination",year:1963},{name:"None",year:0}];
	this.evYear = this.events[0].year;
	this.selectedAge = this.dataYear - this.evYear +this.ageCon;
	this.isCompare = function(){
							return this.pies.length > 1;
						}
	
	this.getScale = function(width){
						var max = 0
						var min = Infinity
						
						for (var i=0;i<this.histograms.length;i++){
							this.histograms[i].makeData();
							}
						
						for (var i=0;i<this.histograms.length;i++){
							
							if (this.histograms[i].max > max){
								max = this.histograms[i].max 
							}
							
							if (this.histograms[i].min < min){
								min = this.histograms[i].min 
							}
						}
						
						var off = (max-min)/10
						
						var scale = d3.scale.linear().
							range([0,width]).
							domain([0,max+off])//Math.max(min-off,0),max+off])
						
						return scale;
						
					}
					
	this.getPieScale = function(width){
		 var max=0;
		 
		 for (i in that.pies){
			 that.pies[i].makeData();
			 var t =that.pies[i].getTot();
			 if (  t> max){
				 max= t
			 }
		 }
		 var scale = d3.scale.linear().
							range([30,width]).
							domain([0,max])//Math.max(min-off,0),max+off])
						
		return scale;
	}				
					
					
	this.statesDiv = this.display.append("div").style("width",100+"%").style("height",this.compareBoxH+"%")
	for (i=0;i<3;i++){
		var div = this.statesDiv.append("div").attr("id","State"+i).attr("class","stateBox")
							  .style("width","0%").style("height",95+"%").style("float","left")
		
		div.append("div").style("width","100%").style("height","5%").style("text-align","center").append("h3");
		
		div.append("div").attr("class","stateGraph")
					.style("height","55%").style("width","100%")
					.attr().attr("id","l"+i)//.style("float","left")
		div.append("div").attr("class","stateGraph")
					.style("height","35%").style("width","100%")
					.attr().attr("id","r"+i)//.style("float","right")
	}

	this.footer = this.display.append("div").attr("id","FooterBox")
							.style("width","100%").style("height",(100-this.compareBoxH-5)+"%").style("padding-bottom","20px")
	

/*
	this.footer.append("p").text("ChangeBuckets").style("display","inline").on("click",function(){
		 that.changeBuckets()
	});
	this.footer.append("p").text("ChangePerc").style("display","inline").on("click",function(){
			that.changePercentage()
		}
	);
	
*/
	
	this.changeBucketsSize = function(x){
		that.bucketSize = x
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].bSize = (x);
		}
		
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].updateGraph();
			that.histograms[ind].highlightData()
		}
		for (var i=0;i<that.pies.length;i++){
			that.pies[i].bSize = x;
			that.pies[i].refreshGraph()
		}
		if (that.buckets == true){
			
			legend.changeBarSize(that.bucketSize);
			}
	}
	
	this.changeBuckets = function(){
		that.buckets = !(that.buckets)
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].buckets = (that.buckets);
		}
		
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].updateGraph();
			that.histograms[ind].highlightData()
		}
		for (var i=0;i<that.pies.length;i++){
			that.pies[i].buckets = that.buckets;
			that.pies[i].refreshGraph()
		}
		
		if (that.buckets == true){
			that.menuBuck.enable();
			legend.changeBarSize(that.bucketSize);
		}else{
			that.menuBuck.disable();
			legend.changeBarSize(1);
		}
	}
	
	this.changeEstimates = function(){
		that.useEstimates = !(that.useEstimates)
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].useEstimates = (that.useEstimates);
		}
		
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].updateGraph();
			that.histograms[ind].highlightData()
		}
		for (var i=0;i<that.pies.length;i++){
			that.pies[i].useEstimates = that.useEstimates;
			that.pies[i].refreshGraph()
		}
	}
	
	this.changePercentage = function(){
		that.percentage = !(that.percentage);
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].percentage = (that.percentage);
		}
		for (var ind=0;ind<that.histograms.length;ind++){
			
			that.histograms[ind].updateGraph();
			that.histograms[ind].highlightData();
		}
		for (var i=0;i<that.pies.length;i++){
			that.pies[i].percentage = that.percentage;
			
		}
		for (var i=0;i<that.pies.length;i++){
			that.pies[i].refreshGraph()
		}
	}
	
	this.changeAgeCon = function(){
		that.ageCon = (that.ageCon==12)?0:12;
		
		var y=that.dataYear - that.evYear + that.ageCon;
		 
		 for (var h in that.histograms){
			 that.histograms[h].ageThreshold = y
			 that.histograms[h].highlightData()
		 }
		 for (var p in that.pies){
			 that.pies[p].ageThreshold = y
			 that.pies[p].refreshGraph()
		 }
		 
		 that.selectedAge = y
		 
		 if (that.ageCon==12){
			 legend.changeBorn("Conscious");
		 }else{
			 legend.changeBorn("Born");
		 }
	} 

	this.toolBox=this.footer.append("div").attr("id","ToolBox").style("width","70%").style("float","left").style("height","100%")
	this.leftToolBox=this.toolBox.append("div").attr("id","LeftToolBox").style("width","70%").style("float","left").style("height","100%")
	this.rightToolBox=this.toolBox.append("div").attr("id","RightToolBox").style("width","30%").style("float","left").style("height","100%")
	
	this.rightTool = this.footer.append("div").attr("id","rightToolbox").style("width","30%")
				.style("height","100%").style("float","left").style("overflow","visible")
				
	
	
	
	this.toolBox = new toolBox("#LeftToolBox",this)
	this.menuBuck = new svgSquareMenu("#RightToolBox",[{name:10},{name:5},{name:3},{name:2}],function (d){ that.changeBucketsSize(parseInt(d.name))},"Bucket Size:")
	this.menu = new svgMenu("#rightToolbox",this.events,function (d){ that.changeEvent(d.year)},"Selected Event:")
	
	
	//this.eventSelect = this.footer.append("select").attr("id","eventSelect").on("change",function(){that.changeEvent()});
	
/*
	for (var e in this.events){
		this.eventSelect.append("option").text(this.events[e].name).attr("value",this.events[e].year);
	}
	
*/
	this.histograms = []
	this.pies = []
	
	this.dispose = function() {
						
					}
	this.showGraphs = function(){
		var pee;
		var hi;
		for(var index=0;index<this.statesDisplayed.length;index++){
			var stDiv = this.display.select("#State"+this.statesDisplayed[index].i)
			stDiv.style("width",(this.compareBoxW/this.statesDisplayed.length)+"%")
			
			var s = this.statesDisplayed[index].s
			stDiv.select("h3").text(s)
			this.histograms.push(new ageHistogram("#l"+index,s,this));
			this.pies.push(new agePieGraph("#r"+index,s,this));
		}
		
		for (var i=0;i<this.histograms.length;i++){
			this.histograms[i].percentage = this.percentage;
			this.histograms[i].buckets = this.buckets;
			this.histograms[i].bSize = this.bucketSize;
			this.histograms[i].useEstimates = this.useEstimates;
			this.histograms[i].ageThreshold = this.selectedAge;
			this.histograms[i].refreshGraph()
			this.histograms[i].highlightData()
		}
		for (var i=0;i<this.pies.length;i++){
			this.pies[i].percentage = this.percentage;
			this.pies[i].buckets = this.buckets;
			this.pies[i].bSize = this.bucketSize;
			this.pies[i].useEstimates = this.useEstimates;
			this.pies[i].ageThreshold = this.selectedAge;
			this.pies[i].refreshGraph()
		}
	}
	
	
	this.showGraphs()
	
	this.findFirstFreeIndex = function(){
		for (var j=0;j<3;j++){
			var used = false;
			for (var k=0;k<this.statesDisplayed.length;k++){
				if (this.statesDisplayed[k].i==j){
					used = true;
				}
			
			}
			if (!(used)){
				console.log(j)
				return j
			}
		}
	}
	
	
	this.addState= function(stateName){
					var oldN = this.statesDisplayed.length
				   if (this.statesDisplayed.length<3){
					   var newIndex = this.findFirstFreeIndex();//this.statesDisplayed.length
					   var stDiv = this.display.select("#State"+newIndex)
					   
					   
					   this.statesDisplayed.push({s:stateName,i:newIndex})
					   
					   stDiv.style("width",0+"%")
					   
					   var s = stateName
					   this.histograms.push(new ageHistogram("#l"+newIndex,s,this));
					   this.pies.push(new agePieGraph("#r"+newIndex,s,this));
					   
					   stDiv.select("h3").text(s)
					   var last = this.histograms.length -1;
					   
					   this.histograms[last].percentage = this.percentage;
					   this.histograms[last].buckets = this.buckets;
					   this.histograms[last].bSize = this.bucketSize;
					   this.histograms[last].useEstimates = this.useEstimates;
					   this.histograms[last].ageThreshold = this.selectedAge;
					   this.histograms[last].refreshGraph();
					   this.histograms[last].highlightData();
					   
					   last = this.pies.length -1;
					   
					   this.pies[last].percentage = this.percentage;
					   this.pies[last].buckets = this.buckets;
					   this.pies[last].bSize = this.bucketSize;
					   this.pies[last].useEstimates = this.useEstimates;
					   this.pies[last].ageThreshold = this.selectedAge;
					   this.pies[last].refreshGraph()
					   
					    // to pass different variables
					   // The ones already there
					   for(var index=0;index<this.statesDisplayed.length-1;index++){
						   
								var stDiv = this.display.select("#State"+this.statesDisplayed[index].i)
								
								var oldH = stDiv.style("width")=="0px"?0:(this.compareBoxW/oldN)
								
								var newH = this.compareBoxW/this.statesDisplayed.length
								stDiv.transition().duration(1500).
								styleTween("width", function() {
									
									 return d3.interpolate(oldH+"%", newH+"%"); }).style("opacity","1.0");
								
								this.histograms[index].updateGraph()
								this.histograms[index].highlightData()
								this.pies[index].refreshGraph()
							
							}
								
						// Entering one
						var index = this.statesDisplayed.length-1
						var stDiv = this.display.select("#State"+this.statesDisplayed[index].i)
						
						
						
						var newH = this.compareBoxW/this.statesDisplayed.length
						stDiv.transition().duration(1500).
						styleTween("width", function() {
							
							 return d3.interpolate(0+"%", newH+"%"); }).style("opacity","1.0");
						
						this.histograms[index].updateGraph()
						this.histograms[index].highlightData()
						this.pies[index].refreshGraph()
						return true
				   }
				   return false
				   
				  
						
				   
				   
	}
	
	this.removeState= function(stateName){
					var oldN = this.statesDisplayed.length
					for(var i=0; i<this.statesDisplayed.length;i++){
						if (this.statesDisplayed[i].s == stateName){
							var x = this.statesDisplayed[i].i
							this.statesDisplayed.splice(i, 1)
							
							var stDiv = this.display.select("#State"+x)
							stDiv.transition().duration(1500).style("width","0px").style("opacity","0")
							for (var j=0;j< this.histograms.length;j++){
								if (this.histograms[j].state == stateName){
									this.histograms[j].removeGraph()
									this.histograms.splice(j, 1)
									
								}
							}
							for (var j=0;j< this.pies.length;j++){
								if (this.pies[j].state == stateName){
									this.pies[j].removeGraph()
									this.pies.splice(j, 1)
								}
							}
						}
					}
				  
						
					
				   
				   for(var index=0;index<this.statesDisplayed.length;index++){
						var stDiv = this.display.select("#State"+this.statesDisplayed[index].i)
						var oldH = this.compareBoxW/oldN
						var newH = this.compareBoxW/this.statesDisplayed.length
						stDiv.transition().duration(1500).
						styleTween("width", function() {
							 return d3.interpolate(oldH+"%", newH+"%"); });
						this.histograms[index].updateGraph()
						this.histograms[index].highlightData()
						this.pies[index].refreshGraph()
						}
							   
				   
	}
	
	
	
	this.changeEvent = function(evYear){
		this.evYear = evYear;
		 var y=this.dataYear-evYear+this.ageCon;
		 
		 for (var h in this.histograms){
			 this.histograms[h].ageThreshold = y
			 this.histograms[h].highlightData()
		 }
		 for (var p in this.pies){
			 this.pies[p].ageThreshold = y
			 this.pies[p].refreshGraph()
		 }
		 
		 this.selectedAge = y
	}
}