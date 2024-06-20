function hurricanePositionAt(h,d){
	
	
	
	var date = d.getFullYear()+ ""+ (d.getMonth()+1<10?"0"+(d.getMonth()+1):(d.getMonth()+1)) +""+(d.getDate()<10?"0"+d.getDate():d.getDate());
	var time = d.getHours() + "" + (d.getMinutes()<10?"0"+(d.getMinutes()):(d.getMinutes()));
	var mindiff = 2400;
	var bestPoint= null
	var pointChanged = false
	var nextPoint = null
	
	for (p in h['points']){
		var point = h['points'][p];
		if (pointChanged){
			nextPoint = point
		}
		
		pointChanged=false;
		if (date==point['date']){
			if (parseInt(time)>=parseInt(point['hour'])){
				bestPoint = point;
				pointChanged=true;
				nextPoint=null
			}
		}
	}
	
	if (nextPoint){
		var estPoint = interpolatePoints(bestPoint,nextPoint,d);
		return estPoint;
	}
	return bestPoint;
	
}

function interpolatePoints(a,b,d){
	var res={"date":a["date"],"hour":a["hour"],"type":a["type"],"maxSpeed":a["maxSpeed"],"ident":a["ident"],
			 "34NE":a["34NE"], "34NW":a["34NW"],"34SE":a["34SE"], "34SW":a["34SW"],
			 "50NE":a["50NE"], "50NW":a["50NW"],"50SE":a["50SE"], "50SW":a["50SW"],
			 "64NE":a["64NE"], "64NW":a["64NW"],"64SE":a["64SE"], "64SW":a["64SW"]
	}
	
	var d1= hurricaneDateToJS(a["date"],a["hour"])
	var d2= hurricaneDateToJS(b["date"],b["hour"])
	var tot = dateDiff(d1,d2)
	var dist = dateDiff(d,d1)/tot
	
	
	res["lat"] = (b["lat"]*dist+a["lat"]*(1-dist)); 
	
	res["lon"] = (b["lon"]*dist+a["lon"]*(1-dist)); 
	
	return res;
}

function dateDiff(d1,d2){
	return Math.abs(d2.getTime()-d1.getTime());
}

function hurricaneDateToJS(date,time){
	var year = Math.floor(date/10000);
	var month = Math.floor((date % 10000)/100)-1;
	var day = date%100;	
	var hour = time /100;
	var min = time % 100;
	return new Date(year,month,day,hour,min);
}


function firstPointInHurricanes(h){
	var minDate=Infinity;
	var minTime=2500;
	
	for (var hurricaneI in h){
			var hurricane = h[hurricaneI];
			for (var pointI in hurricane['points']){
				
				var point = hurricane['points'][pointI];
				if (parseInt(point['date'])<minDate){
					minDate = parseInt(point['date']);
					if (parseInt(point['hour'])< minTime){
						minTime = parseInt(point['hour']);
					}
				}
			}
		}
	var year = Math.floor(minDate/10000);
	var month = Math.floor((minDate % 10000)/100)-1;
	var day = minDate%100;	
	var hour = minTime /100;
	var min = minTime % 100;
	return new Date(year,month,day,hour,min);
}

function lastPointInHurricanes(h){
	var maxDate=0;
	var maxTime=0;
	
	for (var hurricaneI in h){
			var hurricane = h[hurricaneI];
			for (var pointI in hurricane['points']){
				
				var point = hurricane['points'][pointI];
				if (parseInt(point['date'])>maxDate){
					maxDate = parseInt(point['date']);
					if (parseInt(point['hour'])> maxTime){
						maxTime = parseInt(point['hour']);
					}
				}
			}
		}
	var year = Math.floor(maxDate/10000);
	var month = Math.floor((maxDate % 10000)/100)-1;
	var day = maxDate%100;	
	var hour = maxTime /100;
	var min = maxTime % 100;
	return new Date(year,month,day,hour,min);
}

function getHurricaneType(h){
	if (h["type"]==" HU"){
		if (h["maxSpeed"]<82){
			return "HU1"
		}
		if (h["maxSpeed"]<95){
			return "HU2"
		}
		if (h["maxSpeed"]<112){
			return "HU3"
		}
		if (h["maxSpeed"]<136){
			return "HU4"
		}
		return "HU5"
	}
	if (h["type"]==" TS" || h["type"]==" TD"){
		return "TS";
	}
	if (h["type"]==" SS" || h["type"]==" SD" || h["type"]==" EX"){
		return "EX";
	}
	return "EX";
}

