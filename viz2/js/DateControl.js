var DateControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    initialize: function (time,options /*{ data: {...}  }*/) {
    // constructor
    this.time=time;
    L.Util.setOptions(this, options);
	},

    onAdd: function (map) {
        // create the control container with a particular class name
        var cont= L.DomUtil.create('div', 'date-control');
		
		this.container = d3.select(cont);
		//Calculating the right size from the body size
		this.w= parseInt(d3.select("body").style("width"))*0.15+"px";
		this.h= parseInt(d3.select("body").style("height"))*0.10+"px";
		this.container.style("width",this.w).style("height",this.h);
		
		this.dateDiv=[]
		for (var i=0;i<3;i++){	
			this.dateDiv[i] = this.container.append("div").attr("id","dateDiv"+i).style("width","100%").style("height","33%").style("padding-top","4px")
		}
		
		this.svg = this.dateDiv[0].append("svg").attr("class","control-svg").attr("viewBox","0 0 200 10").attr("preserveAspectRatio","xMidYMid meet")
		this.svg.append("text").attr("dominant-baseline","hanging").attr("class","time-control-text").text(this.time.toLocaleDateString()+ " " + this.time.toLocaleTimeString());
		
		this.yearProgress= new ProgressBar("1851","2015",this.dateDiv[1]);
		this.dayProgress= new ProgressBar("1","31",this.dateDiv[2]);
		
		
        // ... initialize other DOM elements, add listeners, etc.

        return cont;
    },
    setNewDate: function(newDate){
	    this.time=newDate;
	    this.updateDisplay();
    },
    updateDisplay: function(){
	    this.svg.select("text").text(this.time.toLocaleDateString()+ " " + this.time.toLocaleTimeString());
	    
	    var yearProgress = (this.time.getMonth()*30 +this.time.getDate())/360; // not precise but whatever
	    var dayProgress = (this.time.getSeconds()+this.time.getMinutes()*60+this.time.getHours()*3600)/(24*3600)
	    
	    this.yearProgress.updateProgress(yearProgress);
	    this.yearProgress.changeLabels(this.time.getFullYear()+"",(this.time.getFullYear()+1)+"")
	    
	    this.dayProgress.updateProgress(dayProgress);
	    var today = (this.time.getMonth()+1)+"/"+this.time.getDate()
	    var nextDay = new Date();
	    nextDay.setTime(this.time.getTime()+24*3600*1000);
	    
	    nextDay = (nextDay.getMonth()+1)+"/"+nextDay.getDate()
	    this.dayProgress.changeLabels(today,nextDay)
	   
    }
});