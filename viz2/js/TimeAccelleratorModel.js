function TimeAccelleratorModel(){
	var that=this;
	this.startFakeTime = new Date();
	this.init=function (startDate, speedInHourperSec){
		this.accRate = speedInHourperSec*60*60;//*1000  / 1000  How many milliseconds pass in a real millisecond
		
		this.startRealTime = new Date(); 
		this.startFakeTime = startDate;
	}
	
	this.getTime = function(){
		var now = new Date();
		var timePassed = now.getTime() - that.startRealTime.getTime();
		now.setTime(that.startFakeTime.getTime() + timePassed * that.accRate)
		return now ;
	}
	this.timeWarp = function(){
		that.startFakeTime.setTime(that.getTime().getTime()+that.accRate*1000);
		that.startRealTime = new Date();
	}
	this.changeSpeed= function(newSpeed){
		that.startFakeTime.setTime(that.getTime().getTime());
		that.startRealTime = new Date();
		this.accRate = newSpeed*60*60;
	}
}