function SingleTimelineGraph ( where, data, color, title, start, end ) {

  var width = $( where ).width(),
	  height = $( where ).height();

  var data = data;

  var color = color;

  var margin = { top: height * 0.05 , right: width * 0.02 ,
               	 bottom: height * 0.06 , left: width * 0.02 };

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  var title = d3.select( where )
      .append( "div" )
      .style( "position", "absolute" )
      .style( "z-index", "0" )
      .style( "width", width * 2 / 3 ) 
      .style( "height", width / 40 )
      .style( "top", "0px")
      .style( "left", "0px" )
      .style( "font-size", "4vmin")
      .style( "pointer-events", "none" )
      .text( title );


	var x = d3.time.scale()
		.range( [ 0, width ] );

	var y = d3.scale.linear()
		.range( [ 0, height / 2 - height / 8 ] );

	var format = d3.time.format( "%Y" );
	  
	var stack = d3.layout.stack().offset( "zero" )
		.values( function ( d ) { return d.values; } )
		.x( function ( d ) { return d.date; } )
		.y( function ( d ) { return d.value; } );

	var strokecolor = "#000000";

	var area = d3.svg.area()
		.interpolate( "cardinal" )
		.x( function( d ) { return x( d.date ); } )
		.y0(function( d ) { return height / 2 + height / 15 - y( d.y ); } )
		.y1(function( d ) { return height / 2 + height / 15 + y( d.y ); } );

  	var layers0 = [ { key: data.key, values: data.values.map( function ( a ) {
	      	return { date: a.date, name: a.name, y: 0 , y0: 0 };
	    } ) } ];

	var layers = [ stack( data ) ];

  if ( start && end ) {
    var startDate = new Date( start, 1, 1 );
    var endDate = new Date( end, 1, 1 );
    x.domain( [ startDate, endDate ] );
  } else {
    x.domain( d3.extent( data.values , function ( d ) { return d.date; } ) );
  }

	y.domain( [ 0, d3.max( data.values, function ( d ) { return d.y; } ) ] );

	var svg = d3.select( where ).append( "svg" )
    	.attr( "width", width + margin.left + margin.right )
    	.attr( "height", height + margin.top + margin.bottom );



	var graph = svg.append( "g" )  
    	.attr( "transform", "translate(" + margin.left + "," + 0 + ")" )

	graph.selectAll( "path" )
    	.data( layers0 )
  	.enter().append( "path" )
    	.attr( "d", function ( d ) {
      	return area( d.values );
    	} )
    	.attr( "class", "timeline-path" )
    	.attr( "id", function ( d ) {
      	return d.key + "-timeline-path";
    	} )
    	.style( "fill", color );


  var xAxis = d3.svg.axis()
    .scale( x )
    .orient( "bottom" )
    .ticks( 10 )
    .outerTickSize(0);
  
  graph.append( "g" )
    .attr( "class", "timeline-x-axis" )
    .attr( "transform", "translate(0," + height + ")" )
    .call( xAxis );



	var datearray = [];

  function mouseclick ( d, i ) {

    mousex = d3.mouse( this )[ 0 ];
    mousey = d3.mouse( this )[ 1 ];
    var ix = x.invert( mousex );
    var ixYear = ix.getYear();
    var selected = null;
    var yyyy = null;
    for ( var i = 0; i < d.values.length; ++i ) {
      if ( d.values[ i ].date.getYear() == ixYear ) {
        selected = d.values[ i ];
        yyyy = 1900 + ixYear;
        break;
      }
    }

    if ( selected != null ) {
      tooltip.style( "visibility", "visible" );
      var deltaY = 10;
      var ypos = mousey + ( ( mousey > height / 2 ) ? -deltaY : 4*deltaY );

      tooltip.select( "text" )
        .attr( "y", Math.round( ypos ) )
        .text( "Year: " + yyyy + "  " + "P.I.: " + Math.round( selected.value ) );
      var textWidth = tooltip.select( "text" ).node().getComputedTextLength();
      var xpos, rxpos;
      if ( mousex > width / 2 ) {
        xpos = Math.round( mousex - textWidth + 15 );
        rxpos = xpos;
      } else {
        xpos = Math.round( mousex + 18 );
        rxpos = xpos;
      }
      tooltip.select( "text" )
        .attr( "x", xpos );
      tooltip.select( "rect" )
        .attr( "width", textWidth )
        .attr( "x", rxpos )
        .attr( "y", Math.round( ypos - 15 ) );
    }
  }

  
  function mouseout ( d, i ) {
    tooltip.style( "visibility", "hidden" );
  }


    
  var vertical = d3.select( where )
        .append( "div" )
        .attr( "class", "remove" )
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
         vertical
          .style( "left", mousex + "px" )
          .style( "visibility", "visible" ) 
        } )
      .on( "mouseover", function () {  
         mousex = d3.mouse( this);
         mousex = mousex[ 0 ] - 1;
         vertical
         .style( "left", mousex + "px" )
         .style( "visibility", "visible" ) 
       } )
      .on( "mouseout", function () {
        vertical.style( "visibility", "hidden" );
      } );


  var tooltip = svg.append( "g" )
      .attr( "class", "tooltip" );
  tooltip.append( "rect" )
      .attr( "height", 20 )
      .style( "fill", "#fff" )
      .style( "stroke-width", "1px" )
      .style( "stroke", "black" )
      .style( "opacity", 1 );
  tooltip.append( "text" ) 
      .attr( "class", "tooltip-text" )
      .attr( "font-size", "2vmin" )
      .text( "" );


	function transition () {
		graph.selectAll( ".timeline-path" )
	        .data( function () {
	        	var t = layers;
	        	layers = layers0;
	        	return layers0 = t;
	        } )
        	// Disable hover during transition
        	.on( "click", null )
          	.on( "mouvemove", null)
        	.on( "mouseout", null )
      	.transition()
        	.duration( 1000 )
        	.attr( "d", function ( d ) { return area( d.values ); } )
        	.attr( "stroke", strokecolor )
	    	.attr( "stroke-width", "0.5px" )
      	.each( "end", function () {
        	// Re-enable hover
        graph.selectAll( ".timeline-path" )
          //.on( "mouseover", mouseclick )
          .on( "mousemove", mouseclick )
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

  	this.getColor = function () {
  		return color;
  	};

  	this.getData = function () {
  		return data;
  	};

    this.getKey = function () {
      return data.key;
    }

    this.getStart = function () {
      return start;
    }

    this.getEnd = function () {
      return end;
    }

  	this.getPaths = function () {
    	return graph.selectAll( ".timeline-path" );
  	};

  	// Animate timeline
  	transition();

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