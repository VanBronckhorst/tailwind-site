var DEBUG = true;

function log(something){
	if(DEBUG){
		console.log(something);
	}
}

//TILES CREATION	
var FilterView = function (){
	'use-strict';

	//VIEWBOX SETTINGS
	this.viewBoxWidth = 800;
	this.viewBoxHeight = this.viewBoxWidth * 1.0;
	this.offsetYViewBox = -40;

	this.observerList = [];//list of observer to notify when filterView is changed by the user

	this.wordBatchSize = 10;
	this.lastWordIndex = 0;

	var filterViewLayout = this;

	var heightSvgList = '57'; //NB it's a percetage!
	this.lists = []; //has all the list displayed: the name of the hurricanes, the speeds
	this.oldLists=[];

	//data initially is empty
	this.data = []; 
	
	//GRAB THE MAP	
	this.map = d3.select('#map'),	


	this.filterViewDiv = this.map.append('div')
	.attr('id','filterView' )
	.attr('class','filterView');


	//appending arrow to control opening and closing filterView
	d3.select('#map').append('div')
	.attr('id', 'divArrowFilter')
	.append('svg')
	.attr("viewBox", "0 0 "+ this.viewBoxWidth+" "+this.viewBoxHeight)
	.style('width','100%')
	.style('height', '100%')
	.append('text')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 800)
	.attr('x', 70 )
	.attr('y', 410)
	.attr('fill', 'black')
	.attr('id', 'arrowResizeFilter')
	.attr('cursor', 'pointer')
	.on('click',resizeFilterView)
	.text(function(d) { return '\uf053'; });

	d3.selectAll(".leaflet-left").style("left","27%");
	
	//code to close and open the panel
	var toggle = true;
	function resizeFilterView(){
		var widthVal = (toggle)? 0 : 25;
		var heightVal = (toggle)? 100 : 100;

		$('#filterView').animate({'width' : widthVal+'%', 'height': heightVal+'%'}, { 
			duration:750,	
			start: function(){
				if(toggle){
					$('#divArrowFilter').animate({
						left: '0'
					}, 'slow');
					$('.leaflet-left').animate({
						left: '1%'
					}, 'slow');
				}else{
					$('#divArrowFilter').animate({
						left: '25%'
					}, 'slow');
					$('.leaflet-left').animate({
						left: '27%'
					}, 'slow');
				}
			},
			complete: function() {
				if(toggle){
					//slide line
					filterViewLayout.underlineLine
					.transition()
					.duration(500)
					.attr('x1', '33%')
					.attr("x2", '42%');
					//PRETEND SEASON WAS CLICKED
					//hide all calendars
					d3.select('#calendarDay')
					.style('visibility', 'hidden');
					d3.select('#calendarYear')
					.style('visibility', 'hidden');

					//show calendar
					d3.select('#svg-season')
					.style('visibility', 'visible');

					//arrow change direction to right
					d3.select('#arrowResizeFilter')
					.text(function() { return '\uf054'; });
				}else{
					//arrow change direction to left
					d3.select('#arrowResizeFilter')
					.text(function() { return '\uf053'; });
				}
				toggle = !toggle;
			}
		});
}

//create svg for filterView
var svg = this.filterViewDiv
.append("svg")
.attr("viewBox", "0 "+ this.offsetYViewBox +" "+ this.viewBoxWidth+" "+this.viewBoxHeight) //VIEWBOX OF THE filtermap
.style('width','100%')
.style('height', '100%');


//add title text
this.g = svg.append('g');

this.g.append('text')
.attr('class','title-controls')	
.text('CONTROLS')
.attr('y', '0')
.attr('x', '80');

this.g.append('text')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 50)
.attr('fill', 'black')
.text(function(d) { return '\uf085'; })
.attr('y', '-20')
.attr('x', '15');


//add container svg for lists
this.svgList = this.g.append('svg')
.attr('id', 'svg-list')	
.append('g');

this.svgList
.append('rect')
.attr('id', 'rect-list')
.attr('height', heightSvgList+ "%")	
.attr('y', '10')
.attr('x', '10');

//add container for filters 
this.svgFilters =this.g.append('svg')
.attr('id', 'svg-filter')	
.append('g');

this.svgFilters
.append('rect')
.attr('id', 'rect-filter')	
.attr('height', (100 - heightSvgList - 5) + "%") //5 is the percentage of empty space at the bottom of the filters
.attr('y', (heightSvgList-(-2))+ "%") //add 2 percent for padding
.attr('x', '10');

//==========ADD SELECTOR FOR PERIODS
this.svgFilters
.append('text')
.text('SEASON')
.on('click',function(){
	//slide line
	filterViewLayout.underlineLine
	.transition()
	.duration(500)
	.attr('x1', '33%')
	.attr("x2", '42%');
	//hide all calendars
	d3.select('#calendarDay')
	.style('visibility', 'hidden');
	d3.select('#calendarYear')
	.style('visibility', 'hidden');

	//show calendar
	d3.select('#svg-season')
	.style('visibility', 'visible');
})
.attr('cursor', 'pointer')
.style('font-size', 18)
.attr('y', (heightSvgList-(-6))+ "%") 
.attr('x', '33%');

this.svgFilters
.append('text')
.text('DAY')
.on('click',function(){
	//slide line
	filterViewLayout.underlineLine
	.transition()
	.duration(500)
	.attr('x1', '26%')
	.attr("x2", '30%');

	//hide all calendars
	d3.select('#svg-season')
	.style('visibility', 'hidden');
	d3.select('#calendarYear')
	.style('visibility', 'hidden');

	//show calendar
	d3.select('#calendarDay')
	.style('visibility', 'visible'); //this calendar is for the day
})
.attr('cursor', 'pointer')
.style('font-size', 18)
.attr('y', (heightSvgList-(-6))+ "%") 
.attr('x', '26%');

this.svgFilters
.append('text')
.text('YEAR')
.on('click',function(){
	//slide line
	filterViewLayout.underlineLine
	.transition()
	.duration(500)
	.attr('x1', '16%')
	.attr("x2", '22%');

	//hide all calendars
	d3.select('#svg-season')
	.style('visibility', 'hidden'); 
	d3.select('#calendarDay')
	.style('visibility', 'hidden');

	//show calendar
	d3.select('#calendarYear')
	.style('visibility', 'visible');	//this calendar is only for the year
})
.attr('cursor', 'pointer')
.style('font-size', 18)
.attr('y', (heightSvgList-(-6))+ "%") 
.attr('x', '16%');

this.svgFilters
.append('text')
.text('PICK:')
.style('font-size', 25)
.attr('y', (heightSvgList-(-6))+ "%") 
.attr('x', '3%');

//=========ADD LINE TO UNDERLINE PERIOD
this.underlineLine = this.svgFilters
.append("line")
.attr('y1',(heightSvgList-(-7))+ "%") 
.attr('x1', '16%')
.attr('y2', (heightSvgList-(-7))+ "%") 
.attr('x2', '23%')
.attr("stroke-width", 2)
.attr("stroke", "black");

//SVG SEASON PICKING==============================================================================
this.svgSeason =this.g.append('svg')
.attr('id', 'svg-season')	
.attr('visibility', 'hidden')
.append('g');

//========ATLANTIC===============
var atlanticOn = false;
this.svgSeason
.append('rect')
.on('click',function(){
	if(!atlanticOn){
		this.setAttribute('class', 'seasonOn');
		d3.select('#rect-season-pacific').attr('class', 'seasonOff');
		pacificOn = false;
	}else{
		this.setAttribute('class', 'seasonOff');
	}
	atlanticOn = !atlanticOn;
	var start = currentYear+"0501"; //first May of currentYear
	var end =  currentYear+"1130"; // 30th Nov of currentYear
	//notify				
	filterViewLayout.notifyAll(new RangeFilter('startDate',start,end,'range')); 
})
.attr('cursor', 'pointer')
.attr('id', 'rect-season-atlantic')	
.attr('height', (100 - heightSvgList - 30) + "%") 
.attr('y', (heightSvgList-(-9))+ "%") 
.attr('x', '5%');

this.svgSeason
.append('text')
.text('ATLANTIC SEASON')
.style('font-size', 20)
.attr('y', (heightSvgList-(-12))+ "%") 
.attr('x', '12%');

this.svgSeason
.append('text')
.text('MAY')
.style('font-size', 15)
.attr('y', (heightSvgList-(-16))+ "%") 
.attr('x', '13%');
this.svgSeason
.append('text')
.text('NOVEMBER')
.style('font-size', 15)
.attr('y', (heightSvgList-(-16))+ "%") 
.attr('x', '34%');

this.svgSeason
.append("line")
.attr('y1', (heightSvgList-(-18))+ "%") 
.attr('x1', '15%')
.attr('y2', (heightSvgList-(-18))+ "%") 
.attr('x2', '40%')
.attr("stroke-width", 2)
.attr("stroke", "black");

this.svgSeason
.append("circle")
.attr("cx", "15%")
.attr("cy",(heightSvgList-(-18))+ "%")
.attr("r", 7);
this.svgSeason
.append("circle")
.attr("cx", "40%")
.attr("cy",(heightSvgList-(-18))+ "%")
.attr("r", 7);

//============PACIFIC===================
var pacificOn=false;
this.svgSeason
.append('rect')
.on('click',function(){
	if(!pacificOn){
		this.setAttribute('class', 'seasonOn');
		atlanticOn = false;
		d3.select('#rect-season-atlantic').attr('class', 'seasonOff');
	}else{
		this.setAttribute('class', 'seasonOff');
	}
	pacificOn = !pacificOn;
	var start = currentYear+"0601"; //first Jun of currentYear
	var end =  currentYear+"1130"; // 30th Nov of currentYear
	//notify				
	filterViewLayout.notifyAll(new RangeFilter('startDate',start,end,'range')); 

})
.attr('cursor', 'pointer')
.attr('id', 'rect-season-pacific')	
.attr('height', (100 - heightSvgList - 28) + "%") 
.attr('y', (heightSvgList-(-22))+ "%") 
.attr('x', '5%');

this.svgSeason
.append('text')
.text('PACIFIC SEASON')
.style('font-size', 20)
.attr('y', (heightSvgList-(-26))+ "%") 
.attr('x', '13%');

this.svgSeason
.append('text')
.text('JUN')
.style('font-size', 15)
.attr('y',(heightSvgList-(-31))+ "%") 
.attr('x', '18%');
this.svgSeason
.append('text')
.text('NOVEMBER')
.style('font-size', 15)
.attr('y', (heightSvgList-(-31))+ "%") 
.attr('x', '34%');

this.svgSeason
.append("line")
.attr('y1', (heightSvgList-(-33))+ "%") 
.attr('x1', '20%')
.attr('y2', (heightSvgList-(-33))+ "%") 
.attr('x2', '40%')
.attr("stroke-width", 2)
.attr("stroke", "black");

this.svgSeason
.append("circle")
.attr("cx", "20%")
.attr("cy",(heightSvgList-(-33))+ "%")
.attr("r", 7);
this.svgSeason
.append("circle")
.attr("cx", "40%")
.attr("cy",(heightSvgList-(-33))+ "%")
.attr("r", 7);

//===========================MIN PRESSURE SELECTOR
//Create scale functions
var pressureScale = d3.scale.linear()
.domain([600,1100])
.range([0,300]);

//Define X axis
var pressureAxis = d3.svg.axis()
.scale(pressureScale)
.ticks(5)
.orient("bottom");

//Create X axis
//this.svgFilters
this.g
.append("g")
.attr("class", "axisFilter") //Assign "axis" class
.attr('id', 'pressureSlider')
.attr("transform", "translate(" + 450 + ","+ 640+")")
.call(pressureAxis);

//add name to slider
this.g
.append("g")
.attr("transform", "translate(" + 550 + ","+ 630+")")
.append('text')
.text('MIN PRESSURE (mb)')
.style('font-size', 18);

//make ticks clickable
d3.select('#pressureSlider')
.selectAll('.tick')
.attr('cursor', 'pointer')
.on('click',pressureClicked)

function pressureClicked(d){
	var ticks = document.getElementById('pressureSlider').getElementsByTagName('text');
	var tickList = Array.prototype.slice.call(ticks);

	tickList
	.forEach(function(d){		
		d.setAttribute('fill', 'black');
		d.setAttribute('stroke', 'black');
		d.setAttribute('stroke-width', '1');
			});

	var a = this.getElementsByTagName('text');
	a[0].setAttribute('fill', 'purple');
	a[0].setAttribute('stroke', 'purple');
	a[0].setAttribute('stroke-width', '2')
	
	min = parseInt(d3.select(a[0]).text().replace(",", ""));
	
	filterViewLayout.notifyAll(new RangeFilter ('minPress',min,2000,'range'));
	
}
//===============MAX WIND SELECTOR
//Create scale functions
var windScale = d3.scale.linear()
.domain([0,180])
.range([0,300]);

//Define X axis
var windAxis = d3.svg.axis()
.scale(windScale)
.ticks(10)
.orient("bottom");

//Create X axis
//this.svgFilters
this.g
.append("g")
.attr("class", "axisFilter") //Assign "axis" class
.attr('id', 'windSlider')
.attr("transform", "translate(" + 450 + ","+ 720+")")
.call(windAxis);

//add name to slider
this.g
.append("g")
.attr("transform", "translate(" + 550 + ","+ 710+")")
.append('text')
.text('MAX WIND SPEED (Kn)')
.style('font-size', 18);

//make ticks clickable
d3.select('#windSlider')
.selectAll('.tick')
.attr('cursor', 'pointer')
.on('click',windClicked)


function windClicked(d){
	var ticks = document.getElementById('windSlider').getElementsByTagName('text');
	tickList = Array.prototype.slice.call(ticks);

	tickList
	.forEach(function(d){		
		d.setAttribute('fill', 'black');
		d.setAttribute('stroke', 'black');
		d.setAttribute('stroke-width', '1');

	});

	var a = this.getElementsByTagName('text');
	a[0].setAttribute('fill', 'purple');
	a[0].setAttribute('stroke', 'purple');
	a[0].setAttribute('stroke-width', '2')
	max = parseInt(d3.select(a[0]).text());
	
	filterViewLayout.notifyAll(new RangeFilter ('maxSpeed',0,max,'range'));
	
}
//===============LANDED FILTER

var landedFilterOn = false;

//add landed filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.89 )
.attr('y', (heightSvgList * 1.1)+ "%")
.text('LANDED');

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.82 )
.attr('y', (heightSvgList * 1.1)+ "%")
.on('click',toggleLanded)
.text(function() { return '\uf096'; });

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.955	 )
.attr('y', (heightSvgList * 1.1)+ "%")
.text(function() { return '\uf041'; });


function toggleLanded(){
	//toggle filtet
	landedFilterOn = !landedFilterOn;
	log('landed filter'+ landedFilterOn);
	//change icon
	d3.select(this).text(function() { return (landedFilterOn)?'\uf046':'\uf096'; });
	//notify
	filterViewLayout.notifyAll(new ToggleFilter('landfall',landedFilterOn? true: null,'equal'));
}

//===============FAVORITE FILTER

var favoriteOn = false;

//add favorite filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.65 )
.attr('y', (heightSvgList * 1.1)+ "%")
.text('FAVORITE');

this.svgFilters
.append('text')
.attr('id', 'favorite-filter')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.57 )
.attr('y', (heightSvgList * 1.1)+ "%")
.on('click',toggleFavorite)
.text(function() { return '\uf096'; });

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.73 )
.attr('y', (heightSvgList * 1.1)+ "%")
.text(function() { return '\uf005'; });

function toggleFavorite(){
	//toggle filtet
	favoriteOn = !favoriteOn;
	log('favorite filter'+ favoriteOn);
	//change icon
	d3.select(this).text(function() { return (favoriteOn)?'\uf046':'\uf096'; });
	//notify
	if(favoriteOn){	
		filterViewLayout.notifyAll(new  FavoriteFilter('maxSpeed','top',5));
		d3.select('#all-filter').text(function() { return '\uf096'; });
		allFilterOn = false;
	}else{
		//notify
		filterViewLayout.notifyAll(new NoFavoriteFilter());
	}
}
//===============ALL FILTER

var allFilterOn = false;

//add favorite filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.52 )
.attr('y', (heightSvgList * 1.27)+ "%")
.text('ALL');

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('id', 'all-filter')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.48 )
.attr('y', (heightSvgList * 1.27)+ "%")
.on('click',toggleFilterAll)
.text(function() { return '\uf096'; });

function toggleFilterAll(){
	//toggle filtet
	allFilterOn = !allFilterOn;
	log('all filter '+ allFilterOn);
	//change icon
	d3.select(this).text(function() { return (allFilterOn)?'\uf046':'\uf096'; });
	//notify
	if(allFilterOn){
		filterViewLayout.notifyAll(new NoFilter ());
		d3.select('#favorite-filter').text(function() { return '\uf096'; });
		favoriteOn = false;
	}else{
		//notify
		filterViewLayout.notifyAll(new NoFavoriteFilter());
	}
}

//===============PACIFIC FILTER

var pacificFilterOn = true;

//add favorite filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.65 )
.attr('y', (heightSvgList * 1.19)+ "%")
.text('PACIFIC');

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.57 )
.attr('y', (heightSvgList * 1.19)+ "%")
.on('click',toggleFilterPacific)
.text(function() { return '\uf046'; });

function toggleFilterPacific(){
	//toggle filtet
	pacificFilterOn = !pacificFilterOn;
	log('pacific filter '+ pacificFilterOn);
	//change icon
	d3.select(this).text(function() { return (pacificFilterOn)?'\uf046':'\uf096'; });
	//notify
	var value;
	if(atlanticFilterOn && pacificFilterOn){
		value = null;
	}else if(atlanticFilterOn && !pacificFilterOn){
		value = 'A';
	}else if (!atlanticFilterOn && pacificFilterOn){
		value = 'P';
	}else{
		//both are false
		//there is no hurrican in ocean Z so this is a way to hide all
		value = 'Z'; 
	}
	filterViewLayout.notifyAll(new ToggleFilter('ocean',value,'equal'));
}

//===============ATLANTIC FILTER

var atlanticFilterOn = true;

//add  filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.9 )
.attr('y', (heightSvgList * 1.19)+ "%")
.text('ATLANTIC');

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.82 )
.attr('y', (heightSvgList * 1.19)+ "%")
.on('click',toggleFilterAtlantic)
.text(function() { return '\uf046'; });

function toggleFilterAtlantic(){
	//toggle filtet
	atlanticFilterOn = !atlanticFilterOn;
	log('atlantic filter '+ atlanticFilterOn);
	//change icon
	d3.select(this).text(function() { return (atlanticFilterOn)?'\uf046':'\uf096'; });
	//notify
	var value;
	if(atlanticFilterOn && pacificFilterOn){
		value = null;
	}else if(atlanticFilterOn && !pacificFilterOn){
		value = 'A';
	}else if (!atlanticFilterOn && pacificFilterOn){
		value = 'P';
	}else{
		//both are false
		//there is no hurrican in ocean Z so this is a way to hide all
		value = 'Z'; 
	}
	filterViewLayout.notifyAll(new ToggleFilter('ocean',value,'equal'));
}

//===============TOP FILTER

//add top filter
this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.65 )
.attr('y', (heightSvgList * 1.27)+ "%")
.text('TOP:');

this.svgFilters
.append('text')
.attr('id', 'x-filter')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.61 )
.attr('y', (heightSvgList * 1.27)+ "%")
.on('click',function(){
	//toggle out the top filter
	var value = 'z';
	var keys = Object.keys(top);
	for(var i = 0; i < keys.length; i++){
		log(top[keys[i]]);
		top[keys[i]].text(function() { return (keys[i]==value)?'\uf192':'\uf10c'; });
	}

	//reset
	filterViewLayout.notifyAll(new RangeFilter ('maxSpeed',0,2000,'range'));
})
.text(function() { return '\uf00d'; });

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.75 )
.attr('y', (heightSvgList * 1.27)+ "%")
.text('5');
var text5 = this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.72 )
.attr('y', (heightSvgList * 1.27)+ "%")
.on('click',function(){
	toggleTop(5);
})
.text(function() { return '\uf10c'; });

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.84)
.attr('y', (heightSvgList * 1.27)+ "%")
.text('10');

var text10 =this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.81 )
.attr('y', (heightSvgList * 1.27)+ "%")
.on('click',function(){
	toggleTop(10);

})
.text(function() { return '\uf10c'; });

this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-size', 20)
.attr('pointer-events','all' )
.attr('x', this.viewBoxWidth*0.93 )
.attr('y', (heightSvgList * 1.27)+ "%")
.text('15');

var text15 =this.svgFilters
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.9 )
.attr('y', (heightSvgList * 1.27)+ "%")
.on('click',function(){
	toggleTop(15);

})
.text(function() { return '\uf10c'; });

var top={'5':text5, '10':text10, '15':text15};

function toggleTop(value){
	log(value);
	//d3.select('#favorite-filter').text(function(){return '\uf046'});
	
	var keys = Object.keys(top);
	for(var i = 0; i < keys.length; i++){
		log(top[keys[i]]);
		top[keys[i]].text(function() { return (keys[i]==value)?'\uf192':'\uf10c'; });
	}

	//notify
	filterViewLayout.notifyAll(new SliceFilter('maxSpeed',value,'top'));
}


//==============SELECT ALL
this.svgList
.append('text')
.attr('text-anchor', 'middle')
.attr('dominant-baseline', 'central')
.attr('font-family', 'FontAwesome')
.attr('font-size', 20)
.attr('cursor', 'pointer')
.attr('x', this.viewBoxWidth*0.045 )
.attr('y', this.viewBoxHeight*0.04)
.on('click',toggleSelectAll)
.text(function() { return '\uf046'; });
var selectAllOn = true;
function toggleSelectAll(){
	//toggle filtet
	selectAllOn = !selectAllOn;
	log('selectAll filter'+ selectAllOn);

	var operation = (selectAllOn) ? 'addAll' : 'removeAll';
	//notify
	filterViewLayout.notifyAll(new HurricaneNameFilter(null,operation)); 

	//change icon
	d3.select(this).text(function() { return (selectAllOn)?'\uf046':'\uf096'; });
}

//================DATE PICKER
var globH = parseInt(d3.select("body").style("height"));
var calendarY = (globH>1000)?'69%':'60%';

this.filterViewDiv.append('div')
.attr('id', 'calendarDay')
.style('visibility', 'hidden') 
.style('position', 'absolute')
.style('top', calendarY);
this.filterViewDiv.append('div')
.attr('id', 'calendarYear')
.style('visibility', 'visible') 
.style('position', 'absolute')
.style('top', calendarY);

addDatePicker('calendarDay',false);
addDatePicker('calendarYear',true);

var currentYear=2014;
function addDatePicker(id,isYearOnly){
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    //get today date
    var today = new Date();

    //get date in string format to put as default in the input box
    var dd = today.getDate();
    var mm = monthNames[today.getMonth()]; 
    var yyyy = today.getFullYear();
    var defaultDateString = [dd+' '+mm+', '+yyyy,dd+' '+mm+', '+yyyy];

    // add the widget to the given div
    $('#'+id)
    .DatePicker({
    	yearOnly : isYearOnly,    	
    	flat: true,
    	mode:'single',
    	date: new Date(today),
    	current: new Date(today),
    	view: 'years',
    	calendars: 1,
    	starts: 1,
    	onChange: function(formated) {   
    		if(isYearOnly){
    			var dateTokens = $('#'+id).DatePickerGetDate(formated).split('-');
    			log(dateTokens);
    			//var date = new Date(dateTokens[0],dateTokens[1]-1,dateTokens[2]);
    			var start = dateTokens[0] +""+ dateTokens[1]+"" + dateTokens[2] ;
    			var end =dateTokens[0]+""+ 12 +""+ 31  ;
    			log(start);
    			log(end);
    			currentYear = dateTokens[0];
				//notify
				filterViewLayout.notifyAll(new RangeFilter('startDate',start,end,'range')); 

			}else{
				var dateTokens = $('#'+id).DatePickerGetDate(formated).split('-');
				log(dateTokens);
				var day = dateTokens[0] +""+ dateTokens[1]+"" + dateTokens[2] ;
				log(day);
    			//notify
    			filterViewLayout.notifyAll(new ActiveFilter('dates','active',day)); 

    		}
			//turn off season filter
			atlanticOn = false;
			d3.select('#rect-season-atlantic').attr('class', 'seasonOff');
			pacificOn = false;
			d3.select('#rect-season-pacific').attr('class', 'seasonOff');
		}
	});

}

// ================================COLUMNS OF LIST(name,date,maxSpeed,danger)

var listCreator = new ListCreator();
//checkbox is a world on its own=======
this.checkBoxList =  listCreator.checkBoxList(this.svgList);
this.checkBoxList
.on('click',toggleChecked);

function toggleChecked(d){
	
	var newStatus = (d3.select(this).attr('status') === 'true')?'false':'true';
	d3.select(this).attr('status',newStatus);	

	var operation = (newStatus === 'true') ? 'add' : 'remove';

	//change icon
	d3.select(this).text(function() { return (newStatus === 'true')?'\uf046':'\uf096'; });

	//notify
	filterViewLayout.notifyAll(new HurricaneNameFilter(d.name,operation)); 

}	
//name,speed etc.=====
this.list = listCreator.createList(this.svgList,'NAME');
this.listSpeed = listCreator.createList(this.svgList,'MAX SPEED');
this.listDate = listCreator.createList(this.svgList,'START DATE');
//this.listDanger = listCreator.createList(this.svgList,'DANGER');

//SET THE ACTIONS FOR THE ORDER ASCENDING AND DESCENDING ARROWS=========================
d3.select('#des-NAME')
.on('click',function(){
	log('sorting the name');
	//set variable to sort on 
	UtilityView.variable = 'name';
	//sort by descending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
d3.select('#asc-NAME')
.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'name';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
d3.select('#asc-MAXSPEED')
.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'maxSpeed';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
d3.select('#des-MAXSPEED')
.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'maxSpeed';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
d3.select('#asc-STARTDATE')
.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'startDate';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
d3.select('#des-STARTDATE')
.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'startDate';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});

//===========================end ordering functions

this.lists.push(
	{'list':this.list, 'attribute' : 'name'},
	{'list':this.listSpeed,'attribute':'maxSpeed'},
	{'list':this.listDate, 'attribute':'startDate'},
	//{'list':this.listDanger, 'attribute':'maxSpeed'}, //TODO put the right value here
	{'list':this.checkBoxList, 'attribute' : null});

this.oldLists.push(
	{'list':this.list, 'attribute' : 'name'},
	{'list':this.listSpeed,'attribute':'maxSpeed'},
	{'list':this.listDate, 'attribute':'startDate'},
	{'list':this.checkBoxList, 'attribute' : null});


	//add button arrow up
	this.svgList
	.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 20)
	.attr('pointer-events','all' )
	.attr('x', 770 )
	.attr('y', this.viewBoxHeight*0.05)
	.attr('cursor', 'pointer')
	.on('click',function(){slideList('up');})
	.text(function(d) { return '\uf139'; });

	//add button arrow down
	this.svgList
	.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 20)
	.attr('pointer-events','all' )
	.attr('x', 770 )
	.attr('y', this.viewBoxHeight * heightSvgList * 0.0095)
	.attr('cursor', 'pointer')
	.on('click',function(){slideList('down');} )
	.text(function(d) { return '\uf13a'; });


	//function to make the hurricane list slide up or down
	function slideList(direction){ //direction is up or down

		//if the user ask to slide down when there are no more hurricane
		//or to slide up when the list is at the beginning
		//return
		if(direction === 'down' && filterViewLayout.lastWordIndex >= filterViewLayout.data.length - filterViewLayout.wordBatchSize ||
			direction === 'up' && filterViewLayout.lastWordIndex == 0){
			return;	
	}
		//update the lastWord Index accordingly to the direction
		filterViewLayout.lastWordIndex = (direction === 'down') ? 
		d3.min([filterViewLayout.data.length - filterViewLayout.wordBatchSize ,filterViewLayout.lastWordIndex + filterViewLayout.wordBatchSize])
		:d3.max([0,filterViewLayout.lastWordIndex - filterViewLayout.wordBatchSize]);
		
		//calculare the upperIndex for slice
		// the upper is either the max length of data or the last index plust the batch size
		var upperIndexSlice = d3.min([filterViewLayout.data.length,filterViewLayout.lastWordIndex + filterViewLayout.wordBatchSize]);
		log(upperIndexSlice);

		filterViewLayout.lists.forEach(function(d){updateValuesOf(d);})		

		function updateValuesOf(list){
			var attribute = list['attribute'];
			list = list['list'];

		//bind new data 
		list = list
		.data(filterViewLayout.data.slice(filterViewLayout.lastWordIndex,upperIndexSlice));		

		//and remove old elements if any
		list
		.exit()
		.remove();

		//move all elements down or up
		list
		.attr('y', function(d,i){
			return (direction === 'down') ? 
			filterViewLayout.viewBoxHeight*0.7 :
			filterViewLayout.viewBoxHeight*0.1;
		});	

    	// move all the elements to their position
    	list
    	.transition()    	
    	.attr('y', function(d,i){
    		//it's the checkbox
    		if(d[attribute]==null){ 
    			return yValue(i)-5;
    		}	
    		return yValue(i) ;
    	})
    	.text(function(d,i){
    		//it's the checkbox
    		if(d[attribute]==null){ 
    			if(filterViewLayout.dataVisualized.indexOf(d)>-1){
    				log('ok');
    				return '\uf046';
    			}else{
    				log('NOK');
    				return '\uf096';
    			}
    		}	
    		//the date
    		if(attribute ==='startDate'){
    			//return hurricaneDateToJS(d[attribute],'0000').toLocaleDateString();
    			return UtilityView.timeConverter(d[attribute]);
    			//return 'sort';
    		}

    		return d[attribute];
    	})
    	.attr('color','black')
    	.attr('font-size',20 );
    }

    
}
var toReset = false;
    //function to update list when model is updated
    this.update = function(data,dataVisualized){    	
   		//make the list slide to the beginning
   		filterViewLayout.lastWordIndex = 0;     		

    	//change data
    	this.data = data;
    	this.dataVisualized = dataVisualized;
    	if(toReset){
    		//elimino tutto quello che c'era
    		filterViewLayout.lists.forEach(function(list){
    			list = list['list'];
    			list = list.data([]); //empty
    			//and exit
    			//remove
    			list
    			.exit()
    			.remove();
    		})	


    		var listCreator = new ListCreator(true);
    		//checkbox is a world on its own=======
    		filterViewLayout.checkBoxList =  listCreator.checkBoxList(this.svgList);
    		filterViewLayout.checkBoxList
    		.on('click',toggleChecked);

    		function toggleChecked(d){

    			var newStatus = (d3.select(this).attr('status') === 'true')?'false':'true';
    			d3.select(this).attr('status',newStatus);	

    			var operation = (newStatus === 'true') ? 'add' : 'remove';

				//change icon
				d3.select(this).text(function() { return (newStatus === 'true')?'\uf046':'\uf096'; });

				//notify
				filterViewLayout.notifyAll(new HurricaneNameFilter(d.name,operation)); 

			}	
			//name,speed etc.=====
			filterViewLayout.list = listCreator.createList(this.svgList,'NAME');
			filterViewLayout.listSpeed = listCreator.createList(this.svgList,'MAX SPEED');
			filterViewLayout.listDate = listCreator.createList(this.svgList,'START DATE');

			//SET THE ACTIONS FOR THE ORDER ASCENDING AND DESCENDING ARROWS=========================
			d3.select('#des-NAME')
			.on('click',function(){
				log('sorting the name');
	//set variable to sort on 
	UtilityView.variable = 'name';
	//sort by descending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
			d3.select('#asc-NAME')
			.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'name';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
			d3.select('#asc-MAXSPEED')
			.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'maxSpeed';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
			d3.select('#des-MAXSPEED')
			.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'maxSpeed';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
			d3.select('#asc-STARTDATE')
			.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'startDate';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.ascending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});
			d3.select('#des-STARTDATE')
			.on('click',function(){
	//set variable to sort on 
	UtilityView.variable = 'startDate';
	//sort by ascending name
	filterViewLayout.data.sort(UtilityView.descending);
	//update
	filterViewLayout.update(filterViewLayout.data,filterViewLayout.dataVisualized);
});

//===========================end ordering functions


filterViewLayout.lists = [];
log(filterViewLayout.lists);
filterViewLayout.lists.push(
	{'list':this.list, 'attribute' : 'name'},
	{'list':this.listSpeed,'attribute':'maxSpeed'},
	{'list':this.listDate, 'attribute':'startDate'},
	{'list':this.checkBoxList, 'attribute' : null});

			//==============SELECT ALL
			filterViewLayout.svgList
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'central')
			.attr('font-family', 'FontAwesome')
			.attr('font-size', 20)
			.attr('cursor', 'pointer')
			.attr('x', filterViewLayout.viewBoxWidth*0.045 )
			.attr('y', filterViewLayout.viewBoxHeight*0.04)
			.on('click',toggleSelectAll)
			.text(function() { return '\uf046'; });
			var selectAllOn = true;
			function toggleSelectAll(){
			//toggle filtet
			selectAllOn = !selectAllOn;
			log('selectAll filter'+ selectAllOn);

			var operation = (selectAllOn) ? 'addAll' : 'removeAll';
			//notify
			filterViewLayout.notifyAll(new HurricaneNameFilter(null,operation)); 

			//change icon
			d3.select(this).text(function() { return (selectAllOn)?'\uf046':'\uf096'; });
		}

		//add button arrow up
		filterViewLayout.svgList
		.append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-family', 'FontAwesome')
		.attr('font-size', 20)
		.attr('pointer-events','all' )
		.attr('x', 770 )
		.attr('y', filterViewLayout.viewBoxHeight*0.05)
		.attr('cursor', 'pointer')
		.on('click',function(){slideList('up');})
		.text(function(d) { return '\uf139'; });

	//add button arrow down
	filterViewLayout.svgList
	.append('text')
	.attr('text-anchor', 'middle')
	.attr('dominant-baseline', 'central')
	.attr('font-family', 'FontAwesome')
	.attr('font-size', 20)
	.attr('pointer-events','all' )
	.attr('x', 770 )
	.attr('y', filterViewLayout.viewBoxHeight * heightSvgList * 0.0095)
	.attr('cursor', 'pointer')
	.on('click',function(){slideList('down');} )
	.text(function(d) { return '\uf13a'; });

	toReset=false;
	log('ripristino lista');
	log(filterViewLayout.lists);
}
log('oldList');
log(filterViewLayout.oldLists);

filterViewLayout.lists.forEach(function(d){updateSingleList(d);})	

function updateSingleList(list){
	var attribute = list['attribute'];
	list = list['list'];


	list = list
	.data(filterViewLayout.data.slice(0,this.wordBatchSize));
    		//log(list);
    	//7	log(list.enter()[0].length);
    	//	log(list.exit()[0].length);
    		//log(list.update()[0].length);
    	//	log(list.exit()[0].length - list.enter()[0].length);
    	//	log(list.length - list.enter().length);
    		//se la lista è piu corta degli elementi visualizabili
    		if(list.exit()[0].length - list.enter()[0].length>0){
    			toReset = true;    			
    		}
    		

    		//enter
    	/*	list
    		.enter()
    		.append('text')
    		.text(function(d){
    			log(d);
    			return d;
    		})
    		.attr('y', function(d,i){
    			return 20*i;//yValue(i);
    		})
    		.attr('x',function(){
    			return 300;//xOffset + titleXOffset + busyWidth+ columnGap*numberOfListCreated;
    		})
    		.attr('color','black')
    		.attr('font-size',15 );	*/

    		//remove
    		list
    		.exit()
    		.remove();

    		//update
    		list  	
    		.text(function(d,i){
    			//it's the checkbox
    			if(d[attribute]==null){ 
    				if(dataVisualized.indexOf(d)>-1){
    					return '\uf046';
    				}else{
    					return '\uf096';
    				}
    			}

    			//the date
    			if(attribute ==='startDate'){
    				return UtilityView.timeConverter(d[attribute]);
    			}

    			//everything else
    			return d[attribute];
    		});  
    		
    	}
    }

    this.notifyAll= function(newFilter){
    	log('filter modified notifying...');
    	for(var o in this.observerList){    		
    		this.observerList[o].filterUpdated(newFilter); 
    	}
    }


	//**UTILITY**//

	//the function return the y value of the text accordingly to its index
	function yValue(index){
		return index * 40 + 80;
	}
};
//var firstUpdateFilterView = true;
FilterView.prototype.modelUpdated = function(dataVisualized,dataCurrent){	
	log('model updated received');	

	log(dataVisualized);
	log(dataCurrent);
	
	//always update the filters selection
	this.dataVisualized = dataVisualized;

	//update the data shown only if it's different
	if(this.data != dataCurrent){	
		dataCurrent.sort(UtilityView.nameAscending);
		this.update(dataCurrent,dataVisualized);
	}else{
		//update the checkbox only
		this.checkBoxList  	
		.text(function(d,i){
    		//it's the checkbox
    		if(dataVisualized.indexOf(d)>-1){
    			return '\uf046';
    		}else{
    			return '\uf096';
    		}    			

    	});
	}

	/*//by DEFAULT SORT by speed
	//sort by
	this.data.sort(UtilityView.descending);
	//update
	this.update(this.data,this.dataVisualized);*/

	/*if(firstUpdateFilterView){
		function startLayout(){
			fireEvent(document.getElementById("circle5"),'click');
			fireEvent(document.getElementById("usPath17"),'click');
			fireEvent(document.getElementById("manPlusWomanIcon"),'click');

		}
		function fireEvent(obj,evt){

			var fireOnThis = obj;
			if( document.createEvent ) {
				var evObj = document.createEvent('MouseEvents');
				evObj.initEvent( evt, true, false );
				fireOnThis.dispatchEvent(evObj);
			} else if( document.createEventObject ) {
				fireOnThis.fireEvent('on'+evt);
			}
		}
		firstUpdateFilterView = !firstUpdateFilterView;
	}*/


}

FilterView.prototype.addObserver = function(observer){
	log('observer added');
	this.observerList.push(observer);
}





