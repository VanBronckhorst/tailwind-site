function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

var layerManager = new function(){
	this.layers={1:[],2:[],3:[]}
	
	this.add = function (layer,z){
		if (this.layers[z]){
			this.layers[z].push(layer)
		}else{
			this.layers[z]=[];
			this.layers[z].push(layer)
		}
		this.update()
	}
	
	
	this.removeGroup = function(group){
		var ll = group.getLayers();
		for (l in ll){
			this.remove(ll[l]);
		}
	}
	
	this.remove = function (layer){
		for (i in this.layers){
			if (containsObject(layer,this.layers[i]) ){
				this.layers[i]= this.layers[i].filter(function (el) {
                        			return el != layer;
									});	
			}
		}
	}
	
	this.update = function(){
		var count = 0;
		for (var i in this.layers) {
		   if (this.layers.hasOwnProperty(i)) count++;
		}

		for (var i=2;i<count+1;i++){
			var g = this.layers[i];
			for (l in g){
				
				g[l].bringToFront();
			}
		}
	}
	
}