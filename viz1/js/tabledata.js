function TableData(data) {
	var that = this;
	var columnWidth = 150;
	var rowHeight = 40;
	var rowCount = 1;
	var margin ={top : 20, row_title : 20};
	//main group
	that.g = d3.select(document.createElementNS(d3.ns.prefix.svg,"g"));

	that.g
		.append("text")
		.attr("x",columnWidth*2)
		.attr("y",margin.top)
		.attr("text-anchor","end")
		.classed("table-column-title",true)
		.text("POPULATION");

	that.g
		.append("text")
		.attr("x",columnWidth*3)
		.attr("y",margin.top)
		.attr("text-anchor","end")
		.classed("table-column-title",true)
		.text("PERCENTAGE");

	for(i in data){
		var d = data[i];
		var formatter = d3.format(".1%");
		var p = formatter((d.d / _.reduce(data, function(memo, d){ return memo + d.d; }, 0)));
		addRow(d.l, db.format.population(d.d),p);
	}


	function addRow(l,d,p){
		var rowColor = rowCount%2 ? "#777" : "#AAA";
		that.g
			.append("rect")
			.attr("x",columnWidth + margin.row_title*2)
			.attr("y", rowCount*rowHeight - 10)
			.attr("height",rowHeight)
			.attr("width",columnWidth*2 - margin.row_title)
			.attr("fill",rowColor)
			.attr("opacity",0.3);

		that.g
			.append("text")
			.attr("text-anchor","end")
			.attr("x",columnWidth + margin.row_title)
			.attr("y",margin.top + rowCount*rowHeight)
			.classed("table-row-title",true)
			.text(l);

		that.g
			.append("text")
			.attr("x",columnWidth*2)
			.attr("y",margin.top + rowCount*rowHeight)
			.classed("table-row-title",true)
			.attr("text-anchor","end")
			.text(d);

		that.g
			.append("text")
			.attr("x",columnWidth*3)
			.attr("y",margin.top + rowCount*rowHeight)
			.classed("table-row-title",true)
			.attr("text-anchor","end")
			.text(p);

		rowCount += 1;
	}

}