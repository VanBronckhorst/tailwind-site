var Controller = function(){
	//crea il model
	var model = new Model();
	//crea la mappa
	var map = new MapView();

	//crea la filterView
	var filterView = new FilterView();

	//crea i graphs
	var graphsView = new GraphsView();

	//add observers to the model
	model.addObserver(filterView);
	model.addObserver(map);
	model.addObserver(graphsView);

	map.addObserver(graphsView);

	//the controller observes the view for inputs
	filterView.addObserver(this);

	//start everything
	model.init();

	this.filterUpdated = function(filter){
		if(filter.function === 'add' || filter.function ==='remove' || filter.function ==='addAll' || filter.function ==='removeAll'){
			log('chiamata visual');
			model.filterVisual(filter);
		}else{
			model.filterCurrent(filter);
		}

	}

}

var controller = new Controller();
