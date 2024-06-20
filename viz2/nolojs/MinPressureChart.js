function MinPressureChart(dataset, container, columnId, percOn) {

  var hurrData = dataset;
  var chartContainer = container;
  var chartId = columnId;
  var percentageOn = percOn;

  // Tooltip variables
  var tooltipVisible = false;
  var activeCircle;

  // Dataset actually active on this chart
  var actualDataset = [];
  var actualCleanDataset = [];

  // Extract the dataset without NA
  for (var i = 0; i < hurrData.length; i++) {
    if(hurrData[i].MIN_PRESSURE != 'NA') {
      actualCleanDataset.push(hurrData[i]);
    }
  }

  // Define ViewBox dimensions
  var viewBoxWidth = 1400;
  var viewBoxHeight = 500;
  var viewBoxMargin = 50;

  // Define scales
  var xScale = d3.scale.linear()
  .domain([d3.min(hurrData , function (d, i) {
    return parseInt(d.YEAR);
  })-5,
  d3.max(hurrData , function (d, i) {
    return parseInt(d.YEAR);
  })+5])
  .range([viewBoxMargin, viewBoxWidth - viewBoxMargin]);

  /*var xAxisScale = d3.scale.ordinal()
  .domain(d3.range(hurrData.length))
  .rangeRoundBands([viewBoxMargin, viewBoxWidth - viewBoxMargin], 0.2);*/

  var actualLowerboundMinPressure = d3.min(hurrData , function (d, i) {
    if(d.MIN_PRESSURE != 'NA') {
      return parseInt(d.MIN_PRESSURE);
    } else {
      return 999999;
    }
  });

  var yScale = d3.scale.linear().domain(
                                        [d3.min(hurrData , function (d, i) {
                                          if(d.MIN_PRESSURE != 'NA') {
                                            return parseInt(d.MIN_PRESSURE);
                                          } else {
                                            return 999999;
                                          }
                                        }),
                                        d3.max(hurrData , function (d, i) {
                                          if(d.MIN_PRESSURE != 'NA') {
                                            return parseInt(d.MIN_PRESSURE);
                                          } else {
                                            return 0;
                                          }
                                        })])
  .range([viewBoxMargin, viewBoxHeight - viewBoxMargin]);

  // Need a different one cause it is inverted
  var yAxisScale = d3.scale.linear().domain(
                                            [d3.min(hurrData , function (d, i) {
                                              if(d.MIN_PRESSURE != 'NA') {
                                                return parseInt(d.MIN_PRESSURE);
                                              } else {
                                                return 999999;
                                              }
                                            }), d3.max(hurrData , function (d, i) {
                                              if(d.MIN_PRESSURE != 'NA') {
                                                return parseInt(d.MIN_PRESSURE);
                                              } else {
                                                return 0;
                                              }
                                            })])
  .range([viewBoxHeight - viewBoxMargin, viewBoxMargin]);

  // Formatter for the x axis
  formatterXAxis = d3.format("d");

  // Define Axes
  var xAxis = d3.svg.axis()
  .scale(xScale)
  .ticks(10)
  .tickFormat(formatterXAxis);

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
  .text('Min Pressure');

  // Create SVG element
  var svg = container
  .append('svg')
  .attr('id', 'min_press_chart' + chartId)
  .style('width', '100%')
  .style('height', '90%')
  .attr('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);
  //.attr('preserveAspectRatio', 'xMinYMin meet');

  // Setting the line layout function to extract coordinates data from dataset
  var line = d3.svg.line()
  .x(function(d){return xScale(d.YEAR);})
  .y(function(d){
    if(d.MIN_PRESSURE != 'NA') {
      return viewBoxHeight - yScale(parseInt(d.MIN_PRESSURE));
    } else {
      return viewBoxHeight - yScale(actualMinimumMinPressure); //PROVARE ANCHE A RITORNARE -1
    }
  });

  // Creating path lines
  svg.append("path")
  .attr("d", line(actualCleanDataset))
  .attr("class", "min_pressure_lines");

  // Create Circles
  svg.selectAll('circle')
  .data(hurrData)
  .enter()
  .append('circle')
  .attr('class', function (d, i) {
    if(d.MIN_PRESSURE != 'NA') {
      return 'min_pressure_circle';
    } else {
      //console.log('inthecolor');
      return 'min_pressure_circle na';
    }
  })
  .attr('cx', function (d, i) {
    return xScale(d.YEAR);
  })
  .attr('cy', function (d, i) {
    if(percentageOn) {
      //return viewBoxHeight - yScale(parseInt(d.POPEST2014)/totalPopulation);
    } else {
      if(d.MIN_PRESSURE != 'NA') {
        return viewBoxHeight - yScale(parseInt(d.MIN_PRESSURE));
      } else {
        return viewBoxHeight - yScale(actualLowerboundMinPressure);//PROVARE ANCHE A RITORNARE -1
      }
    }
  })
  .attr('r', 4)
  .style('fill', function (d, i) {
    if(d.MIN_PRESSURE != 'NA') {
      //return 'rgb(0,0,128)';
    } else {
      //console.log('inthecolor');
      return 'Black';
    }
  })
  .on("click", function(d) {
    if(!tooltipVisible || this!=activeCircle) {

      //Color old active circle to normal
      if(activeCircle!=null) {
        if(d3.select(activeCircle).attr('class') != 'min_pressure_circle na') {
          d3.select(activeCircle).style('fill', 'rgb(0,0,128)');
        } else {
          d3.select(activeCircle).style('fill', 'Black');
        }
      }

      //Set this circle as the active circle
      activeCircle = this;
      tooltipVisible = true;

      //Color this circle as active
      d3.select(this).style('fill', 'green');

      //Get this circle's cx/cy values, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("cx") - 100);
      var yPosition = parseFloat(d3.select(this).attr("cy") - 140);

      //Update the tooltip position and value
      svg.select("#tooltip")
      .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
      .select("#year_value")
      .text(d.YEAR);

      svg.select("#tooltip")
      .select('#min_pressure_value')
      .text(d.MIN_PRESSURE);

      //Show the tooltip
      svg.select("#tooltip").classed("hidden", false);

    } else {

      tooltipVisible = false;

      //Color this circle as normal
      if(this!=null) {
        if(d3.select(this).attr('class') != 'min_pressure_circle na') {
          d3.select(this).style('fill', 'rgb(0,0,128)');
        } else {
          d3.select(this).style('fill', 'Black');
        }
      }

      //Hide the tooltip
      svg.select("#tooltip").classed("hidden", true);

    }
  });


  //Create X axis
  var myXAxis = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (viewBoxHeight - viewBoxMargin) + ")")
  .call(xAxis);

  //Create Y axis
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + viewBoxMargin + ",0)")
  .call(yAxis);

  /*
  // Hide some ticks
  var xTicksText =  svg.select('.x.axis')
  .selectAll('.tick text');

  xTicksText.style('opacity', function (d, i) {
    if(i%11!==0 && i!=163) {
      return 0;
    } else {
      return 1;
    }
  });
*/

  //Create the tooltip svg
  var tooltip = svg.append('g')
  .attr('id', 'tooltip')
  .attr('class', 'hidden');

  tooltip.append('rect');

  tooltip.append('text')
  .attr('dx', +18)
  .attr('dy', +50)
  .text('Year: ');

  tooltip.append('text')
  .attr('dx', +142)
  .attr('dy', +50)
  .attr('id', 'year_value')
  .text('100');

  tooltip.append('text')
  .attr('dx', +18)
  .attr('dy', +100)
  .text('Min Press.: ');

  tooltip.append('text')
  .attr('dx', +152)
  .attr('dy', +100)
  .attr('id', 'min_pressure_value')
  .text('900');


  // Function to update this chart according to a new dataset given as input
  this.updateGraph = function (dataset) {

    actualDataset = dataset;

    actualLowerboundMinPressure = d3.min(actualDataset, function (d, i) {
      if(d.MIN_PRESSURE != 'NA') {
        return parseInt(d.MIN_PRESSURE);
      } else {
        return 999999;
      }
    });

    actualCleanDataset = [];
    for (var i = 0; i < actualDataset.length; i++) {
      if(actualDataset[i].MIN_PRESSURE != 'NA') {
        actualCleanDataset.push(actualDataset[i]);
      }
    }
    //console.log(actualCleanDataset);

    //Update scale domains
    xScale.domain(
                  [d3.min(actualDataset , function (d, i) {
                    return parseInt(d.YEAR);
                  })-5,
                  d3.max(actualDataset , function (d, i) {
                    return parseInt(d.YEAR);
                  })+5]);
    yScale.domain(
                  [d3.min(actualDataset , function (d, i) {
                    if(d.MIN_PRESSURE != 'NA') {
                      return parseInt(d.MIN_PRESSURE);
                    } else {
                      return 999999;
                    }
                  }),
                  d3.max(actualDataset , function (d, i) {
                    if(d.MIN_PRESSURE != 'NA') {
                      return parseInt(d.MIN_PRESSURE);
                    } else {
                      return 0;
                    }
                  })]);
    // Need a different one cause it is inverted
    yAxisScale.domain(
                      [d3.min(actualDataset , function (d, i) {
                        if(d.MIN_PRESSURE != 'NA') {
                          return parseInt(d.MIN_PRESSURE);
                        } else {
                          return 999999;
                        }
                      }), d3.max(actualDataset , function (d, i) {
                        if(d.MIN_PRESSURE != 'NA') {
                          return parseInt(d.MIN_PRESSURE);
                        } else {
                          return 0;
                        }
                      })]);

    //Select…
    var circles = svg.selectAll('circle')
    .data(actualDataset);

    //console.log(circles);

    //Enter…
    circles.enter().append('circle')
    .attr('class', function (d, i) {
      if(d.MIN_PRESSURE != 'NA') {
        return 'min_pressure_circle';
      } else {
        return 'min_pressure_circle na';
      }
    })
    .attr('cx', function (d, i) {
      return xScale(d.YEAR);
    })
    .attr('cy', viewBoxHeight - viewBoxMargin)
    .attr('r', 4)
    .on("click", function(d) {
      if(!tooltipVisible || this!=activeCircle) {

        //Color old active circle to normal
        if(activeCircle!=null) {
          var temp = d3.select(activeCircle).attr('class');
          //console.log(temp);
          if(temp != 'min_pressure_circle na') {
            d3.select(activeCircle).style('fill', 'rgb(0,0,128)');
          } else {
            d3.select(activeCircle).style('fill', 'Black');
          }
        }

        //Set this circle as the active circle
        activeCircle = this;
        tooltipVisible = true;

        //Color this circle as active
        d3.select(this).style('fill', 'green');

        //Get this circle's cx/cy values, then augment for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("cx") - 100);
        var yPosition = parseFloat(d3.select(this).attr("cy") - 140);

        //Update the tooltip position and value
        svg.select("#tooltip")
        .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
        .select("#year_value")
        .text(d.YEAR);

        svg.select("#tooltip")
        .select('#min_pressure_value')
        .text(d.MIN_PRESSURE);

        //Show the tooltip
        svg.select("#tooltip").classed("hidden", false);

      } else {

        tooltipVisible = false;

        //Color this circle as normal
        if(this!=null) {
          if(d3.select(this).attr('class') != 'min_pressure_circle na') {
            d3.select(this).style('fill', 'rgb(0,0,128)');
          } else {
            d3.select(this).style('fill', 'Black');
          }
        }

        //Hide the tooltip
        svg.select("#tooltip").classed("hidden", true);

      }
    });

    //Update…
    circles
    .transition()
    .duration(750)
    .attr('class', function (d, i) {
      if(d.MIN_PRESSURE != 'NA') {
        return 'min_pressure_circle';
      } else {
        return 'min_pressure_circle na';
      }
    })
    .attr('cx', function (d, i) {
      return xScale(d.YEAR);
    })
    .attr('cy', function (d, i) {
      //console.log(d.POPEST2010_CIV);
      if(percentageOn) {
        //return viewBoxHeight - yScale(parseInt(d.POPEST2014)/totalPopulation);
      } else {
        if(d.MIN_PRESSURE != 'NA') {
          return viewBoxHeight - yScale(parseInt(d.MIN_PRESSURE));
        } else {
          return viewBoxHeight - yScale(actualLowerboundMinPressure);//PROVARE ANCHE A RITORNARE -1
        }
      }
    })
    .style('fill', function (d, i) {
      if(d.MIN_PRESSURE != 'NA') {
        //return 'rgb(0,0,128)';
      } else {
        //console.log('inthecolor');
        return 'Black';
      }
    });


    //Exit…
    circles.exit()
    //.transition()
    //.duration(500)
    //.attr('height', 0)
    //.attr('y', viewBoxHeight - viewBoxMargin)
    //.attr('fill', 'rgba(166,206,227,0.5)')
    //.attr('stroke', 'rgba(255,255,255,0.5)')
    //.attr('x', 0)
    //.attr('width', 0)
    .remove();

    //
    /*svg.select(".min_pressure_lines")   // change the line
    .transition()
    .duration(750)
    .attr("d", line(actualDataset));*/
    //Update lines
    svg.select(".min_pressure_lines")   // change the line
    .style('opacity', 0)
    //.transition()
    //.delay(500)
    //.duration(0)
    .attr("d", line(actualCleanDataset));

    svg.select(".min_pressure_lines")   // change the line
    .transition()
    .delay(600)
    .duration(500)
    .style('opacity', 0.5);

    //Update X axis
    svg.select(".x.axis")
    .transition()
    .duration(500)
    .call(xAxis)
    .selectAll('tick');

    //Update Y axis
    svg.select(".y.axis")
    .transition()
    .duration(500)
    .call(yAxis);

    // Remove old tooltip
    svg.select("#tooltip").remove();

    // Create a new tooltip svg in order to have it on the highest level of the svg
    tooltip = svg.append('g')
    .attr('id', 'tooltip')
    .attr('class', 'hidden');

    tooltip.append('rect');

    tooltip.append('text')
    .attr('dx', +18)
    .attr('dy', +50)
    .text('Year: ');

    tooltip.append('text')
    .attr('dx', +142)
    .attr('dy', +50)
    .attr('id', 'year_value')
    .text('100');

    tooltip.append('text')
    .attr('dx', +18)
    .attr('dy', +100)
    .text('Min Press.: ');

    tooltip.append('text')
    .attr('dx', +152)
    .attr('dy', +100)
    .attr('id', 'min_pressure_value')
    .text('900');



    /*
    // Hide some ticks
    xTicksText = svg.select('.x.axis')
    .selectAll('.tick text');

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
