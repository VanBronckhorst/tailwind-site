var ListCreator = function(again){
	var numberOfListCreated = 0;
	var xOffset = 50;
	var titleY = 40;
	var valuesSize = 20;
	var titleSize = 25;
	var titleXOffset = 5;
	var busyWidth = 0;
	var columnGap = 110;
	var again = again;
	if(again){
		d3.select('#svg-list').selectAll('text').remove();
	}
	this.createList = function(place,name,wantCheckBox){

		//add title 		
		var tit = place
		.append('g')
		.append('text')
		.text(name)
		.attr('y', function(){
			return titleY;
		})
		.attr('x', function(){return xOffset + titleXOffset + busyWidth+ columnGap*numberOfListCreated;})
		.attr('color','black')
		.attr('font-size',titleSize );
		


		//add list texts
		var list = place
		.append('g')
		.selectAll("text")
		.data(['empy','empty','empty','empty','empty','empty','empty','empty','empty','empty'])
		.enter()
		.append('text')
		.text(function(d){
			return d;
		})
		.attr('y', function(d,i){
			return yValue(i);
		})
		.attr('x',function(){
			return xOffset + titleXOffset + busyWidth+ columnGap*numberOfListCreated;
		})
		.attr('color','black')
		.attr('font-size',valuesSize );		

		busyWidth += d3.max([tit[0][0].clientWidth,list[0][0].clientWidth]);

		
		//add orderButton ascending near title
		place
		.append('g')
		.append('text')
		.attr('id', 'asc-'+name.replace(/\s+/g, ''))
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-family', 'FontAwesome')
		.attr('font-size', 20)
		.attr('cursor', 'pointer')
		.attr('x', function(){return xOffset + titleXOffset + busyWidth+ columnGap*numberOfListCreated+10;} )
		.attr('y', function(){
			return titleY-13;
		})			
		.text(function() { return '\uf0de'; });	
		//add orderButton descending near title
		place
		.append('g')
		.append('text')
		.attr('id', 'des-'+name.replace(/\s+/g, ''))
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'central')
		.attr('font-family', 'FontAwesome')
		.attr('font-size', 20)
		.attr('cursor', 'pointer')
		.attr('x', function(){return xOffset + titleXOffset + busyWidth+ columnGap*numberOfListCreated+10;} )
		.attr('y', function(){
			return titleY-5;
		})			
		.text(function() { return '\uf0dd'; });	


		//increase number of lists created
		numberOfListCreated++;

		return list;
	}

	this.checkBoxList = function(place){
			//add checkbox
			var listCheckBox = place
			.append('g')
			.selectAll("text")
			.data(['empy','empty','empty','empty','empty','empty','empty','empty','empty','empty'])
			.enter()
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'central')
			.attr('font-family', 'FontAwesome')
			.attr('font-size', 20)
			.attr('cursor', 'pointer')
			.attr('status','true')
			.attr('x', function(){return xOffset + busyWidth  - 15;} )
			.attr('y', function(d,i){				
				return (yValue(i) - 5);
			})			
			.text(function() { return '\uf046'; });	

			return listCheckBox;		
		}

	//the function return the y value of the text accordingly to its index
	function yValue(index){
		return index * 40 + 80;
	}
}