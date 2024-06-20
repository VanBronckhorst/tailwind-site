

function toolBox(where,parent){
	var that=this
	this.svgW = 1500
	this.svgH = 125
	this.svgHPad = 20
	
	this.buttonsPad = 20
	this.display = d3.select(where)
		
	this.buttons=[{f:"Show Number",s:"Show Percentage",a:parent.changePercentage},{f:"Use Estimates",s:"Use Real Data",a:parent.changeEstimates},{s:"Show Conscious",f:"Show Born",a:parent.changeAgeCon},{s:"Show Single Years",f:"Show Buckets",a:parent.changeBuckets}]
	
	this.div = this.display.append("svg").attr("viewBox","0 0 "+(this.svgW+this.svgHPad)+" "+(this.svgH+this.svgHPad)).attr("preserveAspectRatio","xMinYMid meet").style("height","100%").style("width","100%")

	this.t=[]
	
	for (i in this.buttons){
		var g=this.div.append("g")
		g.append("rect").attr("class","svg-button").attr("width",this.svgW/this.buttons.length-this.buttonsPad)
				.attr("height",this.svgH)
				.attr("x",this.buttonsPad + this.svgW/this.buttons.length*i)
				.attr("y",this.svgHPad/2)
				.attr("ry",30)
				.attr("rx",30)
				.attr("tag",i)
				.on("click",function(){
									
									var i = d3.select(this).attr("tag")
									var butt = that.t[i]
									if (butt.text()==that.buttons[i].f){
										butt.text(that.buttons[i].s)
									}else{
										butt.text(that.buttons[i].f)
									
									}
									that.buttons[i].a()
									
									
									 })
		this.t[i] = g.append("text")
				.classed("button-svg-text",true)
				.style("font-size","30px").text(this.buttons[i].f)
				.attr("text-anchor","middle")
				.attr("dominant-baseline", "middle")
				.attr("y",(this.svgH+this.svgHPad)/2 + 0)
				.attr("x",this.svgW/this.buttons.length * i + 1/2 * (this.svgW/this.buttons.length-this.buttonsPad) )
				.attr("dx",this.buttonsPad)
				.attr("tag",i)
				.on("click",function(){
									
									var i = d3.select(this).attr("tag")
									var butt = that.t[i]
									if (butt.text()==that.buttons[i].f){
										butt.text(that.buttons[i].s)
									}else{
										butt.text(that.buttons[i].f)
									
									}
									that.buttons[i].a()
									
									
									 })

				
	}
	
	
	
}