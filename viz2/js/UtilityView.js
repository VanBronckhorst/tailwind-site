var UtilityView = {
	variable : 'maxSpeed', //default 

	descending: function(a,b){		
		if(a[UtilityView.variable]< b[UtilityView.variable])
			return 1;
		if (a[UtilityView.variable] > b[UtilityView.variable])
			return -1;
		return 0;
	},

	ascending: function(a,b){		
		if(a[UtilityView.variable]< b[UtilityView.variable])
			return -1;
		if (a[UtilityView.variable] > b[UtilityView.variable])
			return 1;
		return 0;
	},
	timeConverter: function(date){
    	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    	var year = Math.floor(date/10000);
    	var monthIndex = Math.floor((date % 10000)/100);
    	var month = months[monthIndex-1];

    	var day = date%100;	

    	var time = pad(day,2) + '  ' + month + '  ' + year;
    	return time;

    	function pad(num, size) {
    		var s = "00" + num;
    		return s.substr(s.length-size);
    	}
    }

}