

function MapView(){
	var that=this;
	//INIT SECTION - Initiate the DIV for the map
	d3.select("body").append("div").attr("id","map").attr("class","map-div");
	this.warpOverlay = d3.select("#map").append("div").attr("class","warp-overlay").style("visibility","hidden").text("Warp")
	this.observers = [];
	this.popup = new eventsPopup();
	
	this.addObserver = function(obs){
		this.observers.push(obs);
	}
	//TILES CREATION	
	
	
 	this.geoTile = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: 'mapbox/satellite-v9',
		accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
	
	this.darkTile = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
		tileSize: 512,
		maxZoom: 18,
		zoomOffset: -1,
		id: 'mapbox/dark-v10',
		accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
			
	this.tiles = [this.geoTile,this.darkTile]
	this.baseMaps = {
    "<g class = 'control-layer-text'>Geo Map</g>": this.geoTile,
    "<g class = 'control-layer-text'>Dark Map</g>": this.darkTile,
	};	
	
	//INITIATE THE MAP	
	this.map = L.map('map',{layers: [this.darkTile],
							doubleClickZoom: false,
							markerZoomAnimation: false
	}).setView([28.0, -94.0], 5);		
	L.control.layers(this.baseMaps,null,{position:"topleft"}).addTo(this.map);

	// MAP Variables
	this.dataDisplayed = hurricanes["hurricanes"].slice(hurricanes["hurricanes"].length-20,hurricanes["hurricanes"].length-1);
	this.visualizationModes=["LINES","COMPARE","PLAY"]
	this.visualizationMode = this.visualizationModes[0]
	//Holds The Displayed DATE and Time in PLAY Mode
	this.mapTime= new Date();
	this.dateControl = new DateControl(this.mapTime);
	this.dateControl.addTo(this.map);
	this.legendControl = new LegendControl(null,null);
	this.legendControl.addTo(this.map);
	this.speed = 12;// hours per second
	this.animationUpdate=100;
	this.usingTimeWarp=true;
	this.timeModel = new TimeAccelleratorModel();
	this.hurricaneLayer = L.layerGroup();
	this.hurricaneLayer.addTo(this.map);
	this.markers = {}
	this.trails={}
	this.speedColors = ["#FFD82D","#F98D00","#F42000"]
	this.speedLabels = ["20 Kn","80 Kn","140 Kn"]
	this.pressureColors = ["#DEEBF7","#5CA8D1","#005A9B"]
	this.pressureLabels = ["880 mb","950 mb","1020 mb"]
	this.speedScale = d3.scale.linear().domain([20,80,140]).range(this.speedColors)
	this.pressureScale = d3.scale.linear().domain([880,950,1020]).range(this.pressureColors)
	this.comparingAttr = "speed";
	this.playControl = new PlayControl(this);
	this.playControl.addTo(this.map);
	this.chooseControl = new ChooseControl(this);
	this.chooseControl.addTo(this.map);
	
	this.displayLines = function(){
		if (this.legendControl.isOnMap()){
			this.map.removeControl(this.legendControl);
		}
		this.hurricaneLayer.clearLayers();
		for (var hurricaneI in this.dataDisplayed){
			var hurricane = this.dataDisplayed[hurricaneI];
			for (var pointI in hurricane['points']){
				
				var point = hurricane['points'][pointI];
				if (pointI==0){
					this.hurricaneLayer.addLayer(L.circle([point["lat"],point["lon"]],5,
												{color:"yellow",fillColor: "yellow",
												fillOpacity: 1}));
				}else{
					var line=L.polyline([[point["lat"],point["lon"]],
															[hurricane['points'][pointI-1]["lat"],hurricane['points'][pointI-1]["lon"]]],
															{color: "yellow"})
															.on("click",function(e){ that.hurricaneSelected(e.target.hurr,e.containerPoint.x,e.containerPoint.y);})
					line.hurr=hurricane;
					this.hurricaneLayer.addLayer(line);
				}
			}
		}
	}
	
	this.compareLines = function(){
		this.hurricaneLayer.clearLayers();
		var scale = this.comparingAttr == "speed" ? this.speedScale: this.pressureScale;
		for (var hurricaneI in this.dataDisplayed){
			var hurricane = this.dataDisplayed[hurricaneI];
			for (var pointI in hurricane['points']){
				
				var point = hurricane['points'][pointI];
				if (pointI==0){
					this.hurricaneLayer.addLayer(L.circle([point["lat"],point["lon"]],5,
								{fillColor: scale(this.comparingAttr == "speed" ?point["maxSpeed"]:point["pressure"]),
								color: scale(this.comparingAttr == "speed" ?point["maxSpeed"]:point["pressure"]),
							    fillOpacity: 1}));
				}else{
					var line=L.polyline([[point["lat"],point["lon"]],[hurricane['points'][pointI-1]["lat"],hurricane['points'][pointI-1]["lon"]]],
											{color: scale(this.comparingAttr == "speed" ?point["maxSpeed"]:point["pressure"]),opacity:1})
											.on("click",function(e){ that.hurricaneSelected(e.target.hurr,e.containerPoint.x,e.containerPoint.y); })
					line.hurr=hurricane;
					this.hurricaneLayer.addLayer(line);
				}
			}
		}
		
		if( this.comparingAttr == "speed"){
			if (!this.legendControl.isOnMap()){
				
				this.legendControl.addTo(this.map);
			}
			this.legendControl.changeLegend(this.speedColors,this.speedLabels,"Speed");
			
		}else {
			if (!this.legendControl.isOnMap()){
				this.legendControl.addTo(this.map);
			}
			this.legendControl.changeLegend(this.pressureColors,this.pressureLabels,"Pressure");
			
		}
	}
	
	this.getCloroplethColor = function(d) {
    return d > 10000 ? '#800026' :
           d > 5000  ? '#BD0026' :
           d > 1000  ? '#E31A1C' :
           d > 500  ? '#FC4E2A' :
           d > 100   ? '#FD8D3C' :
           
           d > 10   ? '#FED976' :
                      '#FFEDA0';
	}
	this.cloroplethColors = ['#FFEDA0','#FED976','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026']
	
	this.cloroplethStyle = function(feature) {
    return {
        fillColor: that.getCloroplethColor(feature.properties.danger),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
	
	this.showCloropleth = function(){
		this.hurricaneLayer.clearLayers();
		L.geoJson(statesData,{style: that.cloroplethStyle }).addTo(this.hurricaneLayer);
		if (!this.legendControl.isOnMap()){
				this.legendControl.addTo(this.map);
			}
		this.legendControl.changeLegend(this.cloroplethColors,['Inexistent','Very Low','Low','Medium','High','Very High','Ultra High'],"Danger");
	}
	
	this.hurricaneSelected = function(h,x,y){
/*
		for (o in this.observers){
			obs = this.observers[o];
			obs.hurricaneSelected(h);
		}
*/
		this.popup.update(h["name"]);
		this.popup.show(x,y);
	}
	
	this.displayFrameTime = function(d){
		shown = 0
		
		for (var hurricaneI in this.dataDisplayed){
			var hurricane = this.dataDisplayed[hurricaneI];
			var pointToShow = hurricanePositionAt(hurricane,d);
			if (pointToShow!= null){
				if (this.markers[hurricaneI]){
						shown +=1;
						this.markers[hurricaneI].setLatLng([pointToShow["lat"],pointToShow["lon"] ]);
						this.markers[hurricaneI].setType(getHurricaneType(pointToShow));
						
					}else{
						shown +=1;
						this.markers[hurricaneI] =L.hurricaneMarker([pointToShow["lat"],pointToShow["lon"] ],pointToShow["type"]);
						this.markers[hurricaneI].on("click",function(e){
							
							that.hurricaneSelected(e.target.hurr,e.originalEvent.pageX,e.originalEvent.pageY);
							
						})
						this.markers[hurricaneI].hurr = hurricane;
						this.hurricaneLayer.addLayer(this.markers[hurricaneI]);	
						
					}
				if (this.trails[hurricaneI]){
					addTrail(this.trails[hurricaneI],pointToShow)
				}else{
					this.trails[hurricaneI]=L.layerGroup();
					this.trails[hurricaneI].addTo(this.map);
					addTrail(this.trails[hurricaneI],pointToShow)
				}
					
			}else{
				if (this.markers[hurricaneI]){
					this.hurricaneLayer.removeLayer(this.markers[hurricaneI]);
					this.markers[hurricaneI]=null;
					layerManager.removeGroup(this.trails[hurricaneI])
					this.map.removeLayer(this.trails[hurricaneI]);
					this.trails[hurricaneI]=null;
				}	
			}
		}
		return shown;
	}
	
	this.playFrom = function(start){
		if (this.chooseControl.isOnMap()){
			this.map.removeControl(this.chooseControl);
		}
		if (!this.legendControl.isOnMap()){
				this.legendControl.addTo(this.map);
			}
		this.hurricaneLayer.clearLayers();
		this.markers={};
		this.visualizationMode=["PLAY"];
		this.displayFrameTime(start);
		this.timeModel.init(start,this.speed)
		if (this.timer){
			clearInterval(this.timer)
		}
		this.timer = setInterval(this.updateTime, this.animationUpdate);
		
		this.legendControl.changeLegend(["#bfad23","red","#5ea034","#CEEBF5" ,"#9BCBF2","#326DED"],["Tr. Storm","Hurricane","Tr. Cyclone","34Kn","50Kn","64Kn"],"Type/Speed");
		
	}
	
	this.setMapTime = function (d){
		that.mapTime=d;
		that.dateControl.setNewDate(that.mapTime);
	}
	
	
	this.updateTime = function(){
		var count = 0
		
			
			that.setMapTime(that.timeModel.getTime());
			count = that.displayFrameTime(that.mapTime)
			if (that.mapTime>that.stopTime){
				clearInterval(that.timer)
				
			}
			
			if (that.usingTimeWarp){
				if (count==0){
					that.timeWarp();
					count = that.displayFrameTime(that.mapTime)
					if (that.mapTime>that.stopTime){
						clearInterval(that.timer)
						count=1;
					}
				}else{
					that.warpOverlay.style("visibility","hidden")
				}
			}
		
	}
	
	this.timeWarp = function(){
		// MAybe here print something to say we are warping
		this.warpOverlay.style("visibility","visible")
		that.timeModel.timeWarp();
		that.setMapTime(that.timeModel.getTime());
		
	}
	
	this.playSelected = function(){
		this.mapTime = firstPointInHurricanes(this.dataDisplayed)
		this.stopTime = lastPointInHurricanes(this.dataDisplayed)
		this.playFrom(this.mapTime);
		
	} 
	
	this.pause = function(){
		clearInterval(that.timer);
	}
	
	this.resume = function(){
		that.playFrom(that.mapTime);
	}
	
	this.stop = function(){
		clearInterval(this.timer);
		
		this.setMapTime(new Date());
		
		this.hurricaneLayer.clearLayers();
		
		for (t in this.trails){
			if (this.trails[t]){
				layerManager.removeGroup(this.trails[t])
				this.map.removeLayer(this.trails[t]);
				
			}
		}
		this.playControl.reset();
		this.trails={}
		this.chooseControl.changeSelected(this.chooseControl.getSelected());
		if (! this.chooseControl.isOnMap()){
			this.chooseControl.addTo(this.map);
		}

	}
	
	this.increaseSpeed = function(){
		this.speed *= 2;
		
		this.playControl.updateSpeed(this.speed);
		if (this.timeModel){
			this.timeModel.changeSpeed(this.speed);
		}
	}
	
	this.decreaseSpeed = function(){
		this.speed /= 2;
		
		this.playControl.updateSpeed(this.speed);
		if (this.timeModel){
			this.timeModel.changeSpeed(this.speed);
		}
	}
	
	
	//this.playSelected();
	//this.displayLines();
	//this.compareLines();
	
	this.modelUpdated= function(data){
		this.dataDisplayed = data
		this.stop();
		
		
		//TODO Look at stuff interrupted
	};		
	
	this.changeVisualization = function(choiche){
		if (choiche==0){
			this.comparingAttr="speed";
			this.compareLines();
		}else{
			if (choiche==1){
				this.comparingAttr="pressure";
				this.compareLines();
			}else {
				if (choiche==2){
					
					this.displayLines();
					}
				if (choiche==3){
					
					this.showCloropleth();
					}
			}
		}
	};
	

}

