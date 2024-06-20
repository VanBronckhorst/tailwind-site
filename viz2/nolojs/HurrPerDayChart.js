function HurrPerDayChart(dataset, container, columnId, percOn) {

  var hurrData = dataset;
  var chartContainer = container;
  var chartId = columnId;
  var percentageOn = percOn;

  // Dataset actually active on this chart
  var actualDataset = [];

  // Define ViewBox dimensions
  var viewBoxWidth = 1400;
  var viewBoxHeight = 500;
  var viewBoxMarginX = 10;
  var viewBoxMargin = 50;

  var daysArray = [];

  // Generate days array
  for(var iterator = 0; iterator <= 1250; iterator++) {
    if(dayExists(iterator)) {
      daysArray.push(dayToString(iterator));
    }
  }

   // Define scales
   var xScale = d3.scale.ordinal()
   .domain(daysArray)
   .rangeRoundBands([viewBoxMarginX, viewBoxWidth - viewBoxMarginX], 0.1);


  /*var xAxisScale = d3.scale.ordinal()
  .domain(d3.range(hurrData.length))
  .rangeRoundBands([viewBoxMarginX, viewBoxWidth - viewBoxMarginX], 0.2);*/

  var yScale = d3.scale.linear().domain([0, d3.max(hurrData , function (d, i) {
    return parseInt(d.NUMBER_OF_HURRICANES);
  })])
  .range([viewBoxMargin, viewBoxHeight - viewBoxMargin]);

  // Need a different one cause it is inverted
  var yAxisScale = d3.scale.linear().domain([0, d3.max(hurrData , function (d, i) {
   return parseInt(d.NUMBER_OF_HURRICANES);
 })])
  .range([viewBoxHeight - viewBoxMargin, viewBoxMargin]);

  // Define Axes
  var xAxis = d3.svg.axis()
  .scale(xScale);

  // Formatter for the y axis
  formatter = d3.format(".2%");
  formatterAbs =d3.format(".");

  var yAxis = d3.svg.axis()
  .scale(yAxisScale)
  .orient("left")
  .ticks(10);

  if(percentageOn) {
    yAxis.tickFormat(formatter);
  } else {
    yAxis.tickFormat(formatterAbs);
  }

  // Create Title element
  var title = container
  .append('svg')
  .attr('class', 'graph title')
  .style('width', '100%')
  .style('height', '10%')
  .attr('viewBox', '0 0 ' + 100 + ' ' + 100)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central')
  .attr('font-family', 'Arial')
  .attr('font-size', 80)
  .attr('x', '50%')
  .attr('y', '60%')
  .text('Number of Hurricanes');

  // Create SVG element
  var svg = container
  .append('svg')
  .attr('class', 'svg barchart' + chartId)
  .style('width', '100%')
  .style('height', '90%')
  .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
  //.attr('preserveAspectRatio', 'xMinYMin meet');

  // Create bars
  svg.selectAll('rect')
  .data(hurrData)
  .enter().append('rect')
  .attr('x', function (d, i) {
    return xScale(d.DAY);
  })
  .attr('y', function (d, i) {
    if(percentageOn) {
      //return viewBoxHeight - yScale(parseInt(d.POPEST2014)/totalPopulation);
    } else {
      return viewBoxHeight - yScale(parseInt(d.NUMBER_OF_HURRICANES));
    }
  })
  .attr('width', xScale.rangeBand())
  .attr('height', function (d, i) {
    if(percentageOn) {
      //return yScale(parseInt(d.POPEST2014)/totalPopulation) - viewBoxMargin;
    } else {
      return yScale(parseInt(d.NUMBER_OF_HURRICANES)) - viewBoxMargin;
    }
  })
  /*.attr("fill", function(d, i) {return "rgba(" + 0 + "," + (255 - i*2) + "," + (255 - i*2) + "," + 0.7 + ")"; })*/
  .attr('fill', 'rgb(166,206,227)')
  .attr('stroke', 'black')
  .attr('stroke-width', 1); //then scales with granularity (i*granularity)

  //Create X axis
  var myXAxis = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (viewBoxHeight - viewBoxMargin) + ")")
  .call(xAxis);

  //Create Y axis
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + viewBoxMarginX + ",0)")
  .call(yAxis);

  // Hide some ticks
  var xTicksText =  svg.select('.x.axis')
  .selectAll('.tick text');

  xTicksText.style('opacity', function (d, i) {
    if(i%50!==0) {
      return 0;
    } else {
      return 1;
    }
  });


  // Function to update this chart according to a new dataset given as input
  this.updateGraph = function (dataset) {

    actualDataset = dataset;

    //Update scale domains
    //xScale.domain(["January","February","March","April","May","June","July","August","September","October","November","December"])
    yScale.domain([0,
                  d3.max(actualDataset , function (d, i) {
                    return parseInt(d.NUMBER_OF_HURRICANES);
                  })]);
    // Need a different one cause it is inverted
    yAxisScale.domain([0,
                      d3.max(actualDataset , function (d, i) {
                       return parseInt(d.NUMBER_OF_HURRICANES);
                     })]);

    //Select…
    var bars = svg.selectAll('rect')
    .data(actualDataset);

    //console.log(bars);

    //Enter…
    bars.enter().append('rect')
    .attr('x', function (d, i) {
      return xScale(d.DAY);
    })
    .attr('y', function (d, i) {
      if(percentageOn) {
        //return viewBoxHeight - yScale(parseInt(d.POPEST2014)/totalPopulation);
      } else {
        return viewBoxHeight - yScale(parseInt(d.NUMBER_OF_HURRICANES));
      }
    })
    .attr('width',1)
    .attr('height', function (d, i) {
     if(percentageOn) {
        //return yScale(parseInt(d.POPEST2014)/totalPopulation) - viewBoxMargin;
      } else {
        return yScale(parseInt(d.NUMBER_OF_HURRICANES)) - viewBoxMargin;
      }
    })
    //.attr("fill", function(d, i) {return "rgba(" + 0 + "," + (255 - i*2) + "," + (255 - i*2) + "," + 0.7 + ")"; })
    .attr('fill', 'rgb(166,206,227)')
    .attr('stroke', 'black')
    .attr('stroke-width', 1); //then scales with granularity (i*granularity)


    //Update…
    bars//.attr("fill", function(d, i) { return "rgba(" + 0 + "," + (255 - i*2*granularity) + "," + (255 - i*2*granularity) + "," + 0.7 + ")"; })
    .transition()
    .duration(750)
    .attr('fill', 'rgb(166,206,227)')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('x', function (d, i) {
      return xScale(d.DAY);
    })
    .attr('y', function (d, i) {
      if(percentageOn) {
        //return viewBoxHeight - yScale(parseInt(d.POPEST2014)/totalPopulation);
      } else {
        return viewBoxHeight - yScale(parseInt(d.NUMBER_OF_HURRICANES));
      }
    })
    .attr('width', xScale.rangeBand())
    .attr('height', function (d, i) {
     if(percentageOn) {
        //return yScale(parseInt(d.POPEST2014)/totalPopulation) - viewBoxMargin;
      } else {
        return yScale(parseInt(d.NUMBER_OF_HURRICANES)) - viewBoxMargin;
      }
    });


    //Exit…
    bars.exit()
    //.transition()
    //.duration(500)
    //.attr('height', 0)
    //.attr('y', viewBoxHeight - viewBoxMargin)
    //.attr('fill', 'rgba(166,206,227,0.5)')
    //.attr('stroke', 'rgba(255,255,255,0.5)')
    //.attr('x', 0)
    //.attr('width', 0)
    .remove();


    //Update X axis
    svg.select(".x.axis")
    .transition()
    .duration(500)
    .call(xAxis)
    .selectAll('tick')
    .style('fill', 'blue');

    //Update Y axis
    svg.select(".y.axis")
    .transition()
    .duration(500)
    .call(yAxis);


    // Hide some ticks
    xTicksText = svg.select('.x.axis')
    .selectAll('.tick text');
    /*
    xTicksText.style('opacity', function (d, i) {
      console.log('test');
      if(granularity < 4) {
        hider = 5 - granularity;
      } else {
        hider = 1;
      }
      console.log('innn');
      console.log(d);
      if(i%hider!==0) {
        return 0;
      } else {
        return 1;
      }
    });*/

    //
    /*xTicksText.style('opacity', function (d, i) {
      if(i%11!==0 && i!=163) {
        return 0;
      } else {
        return 1;
      }
    });*/

};


}
