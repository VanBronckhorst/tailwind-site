function svgSquareMenu(where,data,whenSelected,txt){
	var that=this
	this.svgW=50;
	this.svgH = 50;
	this.svgHPad = 10;
	this.hPad=3;
	this.textH=10
	this.menuSVGName = "menuSVG" + (parseInt(Math.random()*1000))
	this.data = data//[{name:"7/11",year:2001},{name:"End of WW2",year:1945},{name:"End of WW1",year:1918}];
	this.selected= this.data[0]
	
	this.svg= d3.select(where)
			.append("div").style("width","100%").style("margin","auto").style("height","100%")//.text(txt)
			.append("svg").attr("id",this.menuSVGName).attr("viewBox","0 0 "+(this.svgW+this.svgHPad)+" "+(this.svgH+this.svgHPad)).attr("preserveAspectRatio","xMinYMid meet").style("height","100%").style("visibility","hidden").style("overflow","visible")
	
	this.label= this.svg.append("text").text("Bucket Size:").style("text-anchor","middle").attr("x",(this.svgW)/2).attr("font-size","7px").attr("y",-2)
	
	
	this.selectG = this.svg.append("g")
	this.selectG.append("rect").attr("class","menuSelectedBox").attr("width",(this.svgW)+"").attr("height",(this.svgH)+"").attr("ry",7)
				.attr("rx",7).attr("x",this.svgHPad/2).attr("y",this.svgHPad/2).on("click",function(){that.show()})
	this.selText = this.selectG.append("text")
				.text(this.selected.name)
				.attr("font-size","10px")
				.attr("text-anchor","middle")
				.attr("dominant-baseline", "middle")
				.attr("y",(this.svgH+this.svgHPad)/2)
				.attr("x",(this.svgW+this.svgHPad)/2 )
				.on("click",function(){that.show()})
	
	
	this.calcRect = function(){var r = document.getElementById(that.menuSVGName).getBoundingClientRect();
								that.menuList.style("left",r.left)
							    .style("width",r.width)
							    .style("height",r.height/2*that.data.length)
							    .style("top",r.top-r.height/2*that.data.length)
							    .style("z-index","100")
				     }
	
	
	d3.select(window).on("resize."+this.menuSVGName, function(){that.calcRect()})	
		
	this.rect = document.getElementById(that.menuSVGName).getBoundingClientRect();		
	var h = (this.textH+this.hPad)*this.data.length+30
	
	
	this.menuList = d3.select("body")
				    .append("svg")
				    .attr("viewBox","0 0 "+this.svgW+" "+(this.svgH/2)*this.data.length)
				    .style("visibility","hidden")
				    .style("position","absolute")
				    .attr("class","menuListSVG")
				    .style("left",this.rect.left)
				    .style("width",this.rect.width)
				    .style("height",this.rect.height/2*this.data.length)
				    .style("top",this.rect.top-this.rect.height/2*this.data.length)
				    .style("z-index","100")
	$(document).mouseup(function (e)
	{
	    d3.selectAll(".menuListSVG").style("visibility","hidden");
	});
	
	this.menuList.append("rect").attr("width",(this.svgW)+"").attr("height",((this.svgH/2)*this.data.length)+"").attr("ry",5)
				.attr("rx",5).attr("fill","white")
						    
	this.menuList.selectAll("text")
				    .data(this.data)
					.enter()
					.append("text")
					.attr("class","menuSvgListElem")
					.text(function(d){return d.name})
					.attr("dx",5)
					.attr("dy",5)
					.on("click",function(d){that.selectedEvent(d)})
					.attr("y",function(d,i){return i*(that.textH+that.hPad)+that.textH})
					.style("opacity",1)
			
	
	this.show= function(){
			if(this.menuList.style("visibility")=="visible"){
				this.menuList.style("visibility","hidden")
			}else{
				this.menuList.style("visibility","visible")
				}
			
	}
	this.hide=function(){
		this.menuList.style("visibility","hidden")
		}
	
	this.selectedEvent = function(ev){
		
		this.selected=ev
		this.selText.text(ev.name)
		this.hide()
		whenSelected(ev)
	}
	
	this.enable = function(){
		this.svg.style("visibility","visible");
	}
	this.disable = function(){
		this.svg.style("visibility","hidden");
	}
	
	//this.show()
	
}