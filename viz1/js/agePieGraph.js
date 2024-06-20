function copyArray(a){
	var res = []
	for (var x in a){
		res.push(a[x])
	}
	return res
}


function agePieGraph(where, stateToDisplay,parent){
	this.svgH = 1000
	this.svgW = 1000
	this.svgXPad = 150
	this.svgYPad = 150
	this.buckets = false;
	this.compare = false;
	this.percentage= true;
	this.ageThreshold = 21;
	this.bSize = 10
	this.state=stateToDisplay
	this.useEstimates = true;
	this.parent = parent;
	
	var that = this;
	this.canvas = d3.select(where).append("svg").attr("height","100%").attr("width","100%").attr("viewBox","0 0 "+(this.svgH+this.svgYPad)+ " " + (this.svgW+this.svgXPad)).attr("preserveAspectRatio","xMidYMin meet");
	this.state = stateToDisplay;
	
	this.getTot = function(){
		var total = 0
		for(i in this.d){
			if (this.percentage){
							total += parseFloat(this.d[i]["perc"])
						}else{
							total += parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
		}
		return total;
	}
	
	this.makeData = function(){
		for(var i=0;i<popAgeSex["states"].length;i++){
				if (popAgeSex["states"][i]["name"] == this.state){
					
					this.d = popAgeSex["states"][i]["buckets"].slice();
					if (this.useEstimates){
						for (var j in popAgeSex["states"][i]["estimates"]){
							this.d.push(popAgeSex["states"][i]["estimates"][j])
						}
					}else{
						for (var j in popAgeSex["states"][i]["lastBucket"]){
							this.d.push(popAgeSex["states"][i]["lastBucket"][j])
						}
					}
				}
			}
	}
	
	this.refreshGraph = function(){
			
			
			
			this.canvas.selectAll("*").remove()
			
			
			this.makeData();
			
			if (this.parent.isCompare()==false){
			var radius = Math.min(this.svgH, this.svgW) / 2;
			}else{
				var sc= this.parent.getPieScale(Math.min(this.svgH, this.svgW) / 2)
				var radius = sc(this.getTot());
			}
			var inRadius = radius/2;
			var labelr = radius + 30 
			

			var arc = d3.svg.arc()
			                .innerRadius(inRadius)
			                .outerRadius(radius);
			var inArc = d3.svg.arc()
			                .innerRadius(0)
			                .outerRadius(inRadius);
			
			this.usedData = []
			var buck = 0
			var no=0;
			var yes=0;
			
			
			if (this.d != NaN){
				//var maxY = Object.keys(this.d).length-1
				if (this.buckets == false){
					for(i=0;i<this.d.length;i++){
						
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
						this.usedData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
						
						if (this.d[i]["start"]<=this.ageThreshold){
							no+=buck
						}else{
							yes+=buck
						}

						}
				}else{
					var tempBuckets = [];
					var bucketMax = [];
					for (var i=0;i<150/this.bSize;i++){
						tempBuckets[i]=0
						bucketMax[i]=0
					}
					
					for(var i=0;i < this.d.length;i++){
						if (this.percentage){
							buck = parseFloat(this.d[i]["perc"])
						}else{
							buck = parseInt(this.d[i]["m"]) + parseInt(this.d[i]["f"])
						}
					    if (this.d[i]["span"]==1){
						    var bucketNumber = Math.floor(this.d[i]["start"]/this.bSize)
						    tempBuckets[bucketNumber] += buck
						    if (this.d[i]["start"] > bucketMax[bucketNumber]){
							    bucketMax[bucketNumber]=this.d[i]["start"]
						    }
						    if (this.d[i]["start"]<=this.ageThreshold){
								no+=buck
							}else{
								yes+=buck
							}
					    }else{
						    if (buck>this.max){
								this.max=buck;
							}
							if (buck<this.min){
								this.min=buck;
							}
							if (this.d[i]["start"]<=this.ageThreshold){
								no+=buck
							}else{
								yes+=buck
							}
						    this.usedData.push({start: this.d[i]["start"] , value: buck,span: this.d[i]["span"]})
					    }
					}
					
					for (var i=0;i<tempBuckets.length;i++){
						if (tempBuckets[i]>0){
							if (tempBuckets[i]>this.max){
								this.max=tempBuckets[i];
							}
							if (tempBuckets[i]<this.min){
								this.min=tempBuckets[i];
							}
							
							this.usedData.push({start: i*this.bSize, value: tempBuckets[i],span: (bucketMax[i]-i*this.bSize+1)})
						}
					}
					
					//Corrector code, put last bucket last
					

					var x = this.usedData[0]
					this.usedData.splice(0, 1)
					this.usedData.push(x)
					this.usedData.sort(function(d,d2){return d.start-d2.start})

					
				}
			}
			this.highData = []
			this.highData.push(no);
			this.highData.push(yes);
			
			
			var pie = d3.layout.pie().value(function(d) { return d.value; }).sort(function(d,d2){return d.start-d2.start})
			this.pieData = pie(this.usedData)	
			var highPie = d3.layout.pie().value(function(d) { return d }).sort(null)
			this.pieHighData = highPie(this.highData)
			// OUTER PIE		
			var arcs = this.canvas.selectAll("g.arc")
							.data(this.pieData)
					        .enter()
					        .append("g")
					        .attr("class", "arc")
					        .attr("transform", "translate(" + (Math.min(this.svgH, this.svgW) / 2 + this.svgXPad/2) + ", " + (Math.min(this.svgH, this.svgW) / 2+ this.svgYPad/2) + ")");
								
								
			var color = d3.scale.linear().domain([0,this.pieData.length]).range(["#FF851B","#85144B"]);
			
			arcs.append("path")
			.attr("stroke","white")
			.attr("stroke-width",3)
		    .attr("fill", function(d, i) {
		        return color(i);
		    })
		    .attr("d", arc);		
			
			
			
			arcs.append("text")
		    .attr("transform", function(d) {
			    if (that.buckets==false){
		        var c = arc.centroid(d),
		        x = c[0],
		        y = c[1],
		        // pythagorean theorem for hypotenuse
		        h = Math.sqrt(x*x + y*y);
		    return "translate(" + (x/h * labelr) +  ',' + (y/h * labelr) +  ")"; 
		       }else{
			       var c = arc.centroid(d)
			       return "translate(" + (c[0]) +  ',' + (c[1]) +  ")"; 
		       }
		    })
		    .attr("text-anchor", "middle")
		    .attr("font-size","250%")
		    .text(function(d,i) {
			    if ((d.endAngle-d.startAngle)*radius>10){
				    if (that.usedData[i].span==1){
			       		return i%3==0?that.usedData[i].start:"";
			       	}else{
				       	return that.usedData[i].start+"-"+(that.usedData[i].start+that.usedData[i].span);
			       	}
			    }else{return ""}
		    });
		    
		    
		    
		    
		    
		    // INNER PIE
			
			
			
			var arcs = this.canvas.selectAll("g.inner-arc")
							.data(this.pieHighData)
					        .enter()
					        .append("g")
					        .attr("class", "inner-arc")
					        .attr("transform", "translate(" + (Math.min(this.svgH, this.svgW) / 2 + this.svgXPad/2) + ", " + (Math.min(this.svgH, this.svgW) / 2+ this.svgYPad/2) + ")");
								
								
			
			
			arcs.append("path")
		    .attr("fill", function(d, i) {
		        return i==1?"yellow":"#007494";
		    })
		    .attr("d", inArc);		
		    
		    arcs.append("text")
		    .attr("transform", function(d) {
		        return "translate(" + inArc.centroid(d) + ")";
		    })
		    .attr("text-anchor", "middle")
		    .attr("font-size","250%")
		    .text(function(d,i) {
			    
		        return (that.highData[i]/(that.highData[0]+that.highData[1])*100).toFixed(2)+"%";
		    });
		    
		    
					
	}
	
	this.changeState = function(name){
		this.state = name;
		this.refreshGraph();
	}
	
	//this.refreshGraph()
	this.removeGraph = function(){
		this.canvas.transition().duration(500).style("opacity",0).each("end",function(){d3.select(this).remove()});
	}
	
	
}