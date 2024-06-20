function DynamicStreamGraph ( where, data, title, start, end ) { 

  var width = $( where ).width(),
      height = $( where ).height();

  var margin = { top: height * 0.05 , right: width * 0.02 ,
                 bottom: height * 0.06 , left: width * 0.02 };

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;


  var title = d3.select( where )
      .append( "div" )
      .style( "position", "absolute" )
      .style( "z-index", "0" )
      .style( "width", width / 2 )
      .style( "height", width / 40 )
      .style( "top", "0px")
      .style( "left", "0px" )
      .style( "font-size", "4vmin")
      .style( "pointer-events", "none" )
      .text( title );


  var x = d3.time.scale()
      .range( [ 0, width ] );

  var y = d3.scale.linear()
      .range( [ height - height / 20, height / 20 ] );

  var format = d3.time.format( "%Y" );
      
  var stack = d3.layout.stack().offset( "silhouette" )
      .values( function ( d ) { return d.values; } )
      .x( function ( d ) { return d.date; } )
      .y( function ( d ) { return d.value; } );

  var nest = d3.nest()
      .key( function ( d ) { return d.name; } );

  var strokecolor = "#000000";

  data.forEach( function ( d, i ) {

    if ( typeof d.date === "string" ) {
      d.date = format.parse( d.date );
    }
    d.value = +d.value;
  } );

  var area = d3.svg.area()
      .interpolate( "cardinal" )
      .x( function( d ) { return x( d.date ); } )
      .y0(function( d ) { return y( d.y0 ); } )
      .y1(function( d ) { return y( d.y0 + d.y ); } );


  var layers = stack( nest.entries( data ) );

  layers0 = layers.map( function ( d, i ) {
    return { key: d.key, values: d.values.map( function ( a ) {
      return { date: a.date, name: a.name, y: 0, y0: 0, value: a.value, color: a.color };
    } ) };
  } );

  layers = layers.map( function ( d, i ) {
    return { key: d.key, values: d.values.map( function ( a ) {
      return { date: a.date, name: a.name, y: a.y, y0: a.y0, value: a.value, color: a.color };
    } ) };
  } );

  var startDate = new Date( start, 1, 1 );
  var endDate = new Date( end, 1, 1 );

  x.domain( [ startDate, endDate ] );

  var yMax = d3.max( data, function ( d ) { return d.y0 + d.y; } );

  y.domain( [ 0, yMax ] );

  var svg = d3.select( where ).append( "svg" )
      .attr( "width", width + margin.left + margin.right )
      .attr( "height", height + margin.top + margin.bottom );


  var graph = svg.append( "g" )  
      .attr( "transform", "translate(" + margin.left + "," + 0 + ")" );

  graph.selectAll( "path" )
      .data( layers )
    .enter().append( "path" )
      .attr( "d", function ( d ) {
        return area( d.values );
      } )
      .attr( "class", "timeline-path" )
      .attr( "id", function ( d ) {
        return d.key + "-timeline-path";
      } )
      .style( "fill", function ( d, i ) { return d.values[ 0 ].color; } )
      .attr( "stroke-width", "1px" )
      .attr( "stroke", strokecolor )
      .on( "mouseover", mouseover )
      .on( "mousemove", mousemove )
      .on( "mouseout", mouseout );

  var datearray = [];

  function mouseover ( d, i ) {
    
    graph.selectAll( ".timeline-path" ).transition()
      .duration( 250 )
      .attr( "opacity", function ( d, j ) {
        return j != i ? 0.07 : 1;
      } );
  } 

  function mousemove ( d, i ) {

    mousex = d3.mouse( this );
    mousex = mousex[ 0 ];
    var invertedx = x.invert( mousex );
    invertedx = invertedx.getYear();
    var selected = ( d.values );
    for ( var k = 0; k < selected.length; ++k ) {
      datearray[ k ] = selected[ k ].date;
      datearray[ k ] = datearray[ k ].getYear();
    }

    mousedate = datearray.indexOf( invertedx );

    pro = Math.round( d.values[ mousedate ].value );

    d3.select( this )
    .classed( "hover", true )
    .attr( "stroke", strokecolor )
    .attr( "stroke-width", "1px" );

    invertedx = 1900 + invertedx;

    tooltip.html( "<p>" + d.key + "<br>" + invertedx + "<br>" + pro + "</p>" ).style( "visibility", "visible" );
  }

  function mouseout ( d, i ) {

   graph.selectAll( ".timeline-path" )
    .transition()
    .duration( 250 )
    .attr( "opacity", "1" );
    d3.select( this )
    .classed( "hover", false )
    //.attr( "stroke-width", "0px" );

    tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style( "visibility", "hidden" );
  }

  var xAxis = d3.svg.axis()
    .scale( x )
    .orient( "bottom" )
    .ticks( 10 )
    .outerTickSize(0);
    
  graph.append( "g" )
      .attr( "class", "timeline-x-axis" )
      .attr( "transform", "translate(0," + height + ")" )
      .call( xAxis );

  var tooltip = d3.select( where ) 
    .append( "div" )
    .attr( "class", "timeline-remove" )
    .style( "position", "absolute" )
    .style( "z-index", "20" )
    .style( "pointer-events", "none" )
    .style( "visibility", "hidden" )
    .style( "top", -10 + "px" )
    .style( "left", width / 2 + width / 8 + "px" );

  var vertical = d3.select( where )
      .append( "div" )
      .attr( "class", "timeline-remove" )
      .style( "position", "absolute" )
      .style( "z-index", "19" )
      .style( "width", "1px" )
      .style( "height", height + "px" )
      .style( "top", "0px" )
      .style( "bottom", "0px" )
      .style( "left", "0px" )
      .style( "background", "#fff" )
      .style( "visibility", "hidden" );

  d3.select( where )
      .on( "mousemove", function () {  
        mousex = d3.mouse( this );
        mousex = mousex[ 0 ] - 1;
        vertical.style( "left", mousex + "px" ).style( "visibility", "visible" ); 
      } )
      .on( "mouseover", function () {  
        mousex = d3.mouse( this );
        mousex = mousex[ 0 ] - 1;
        vertical.style( "left", mousex + "px" );
      } )
      .on( "mouseout", function () {
        vertical.style( "visibility", "hidden" );
      } );

  function transition () {
    graph.selectAll( ".timeline-path" )
        .data( function () {
          var t = layers;
          layers = layers0;
          return layers0 = t;
        } )
        // Disable hover during transition
        .on( "mouseover", null ) 
        .on( "mousemove", null )
        .on( "mouseout", null )
      .transition()
        .duration( 1000 )
        .ease( "exp-out" )
        .attr( "d", function ( d ) { return area( d.values ); } )
      .each( "end", function () {
        // Re-enable hover
        graph.selectAll( ".timeline-path" )
          .on( "mouseover", mouseover )
          .on( "mousemove", mousemove )
          .on( "mouseout", mouseout );
      } );
  }

  this.remove = function () {
    svg.remove();
    graph.remove();
    tooltip.remove();
    vertical.remove();
    title.remove();
  };

  this.getPaths = function () {
    return graph.selectAll( ".timeline-path" );
  }

  this.getData = function () {
    return data;
  }

  this.getStart = function () {
    return start;
  }

  this.getEnd = function () {
    return end;
  }

  // Animate timeline
  //transition();

  var defs = svg.append( "defs" );
  var pattern = defs.append( "pattern" )
      .attr( "id", "mixedColorPattern" )
      .attr( "width", "40" )
      .attr( "height", "40" )
      .attr( "patternUnits", "userSpaceOnUse" )
      //.attr( "patternTransform", "rotate(45)");
  pattern.append( "rect" )
      .attr( "width", "20" )
      .attr( "height", "40" )
      .attr( "transform", "translate(0,0)")
      .attr( "fill", dynamicTimelineColorBlue )
  pattern.append( "rect" )
      .attr( "width", "20" )
      .attr( "height", "40" )
      .attr( "transform", "translate(20,0)")
      .attr( "fill", dynamicTimelineColorRed );



}