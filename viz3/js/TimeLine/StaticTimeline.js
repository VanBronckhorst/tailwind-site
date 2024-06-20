function StaticTimeline ( where ) {
	
	var that = this;

	var artistsGraphTitle = "Top Artists";

	var genresGraphTitle = "Top Genres";

	var buttonsContainerId = "#explore-buttons-container";

	var artistsButtonId = "#explore-artists-button";

	var genresButtonId = "#explore-genres-button";

	var artistsGraph;

	var genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle );

	genresGraph.getPaths()
		.on( "click", onGenreClick );

	var singleArtistGraph;

	var singleGenreGraph; 

	var artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" );

	artistsButton.on( "click", artistsClick );

	var genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

	var nest = d3.nest().key( function ( d ) { return d.name; } );

	function artistsClick () {
		// Remove existing graphs and buttons
		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = null;
		}
		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}
		if ( singleGenreGraph ) {
			singleGenreGraph.remove();
			singleGenreGraph = null
		}
		
		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );
		
		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", genresClick );
		
		// Draw new graph
		artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
		// Enable click on artist
		artistsGraph.getPaths()
			.on( "click", onArtistClick );

		if ( highlightedArtistP1 || highlightedArtistP2 ) {
			that.highlightArtist();
		}
		if ( artistsHelper1 && artistsHelper1.length != 0 || artistsHelper2 && artistsHelper2.length != 0 ) {
			that.highlightGenre();
		}
		if ( decade1 || decade2 ) {
			that.highlightDecade();
		}
		
	} 

	function genresClick () {
		// Remove existing graphs and buttons
		if ( artistsGraph ) {
			artistsGraph.remove();
			artistsGraph = null;
		}
		if ( singleGenreGraph ) {
			singleGenreGraph.remove();
			singleGenreGraph = null;
		}
		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}
		
		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );
		
		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", artistsClick );

		// Draw new graph
		genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle ); // TODO change with genrePopularity when ready
			
		// Enable click on artist
		genresGraph.getPaths()
			.on( "click", onGenreClick );

		if ( genresHelper1 && genresHelper1.length != 0 || genresHelper2 && genresHelper2.length != 0 ) {
			that.highlightArtist();
		}
		if ( highlightedGenreP1 || highlightedGenreP2 ) {
			that.highlightGenre();
		}
		if ( decade1 || decade2 ) {
			that.highlightDecade();
		}
	}


	$( where ).resize( function () {
		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle );
			genresGraph.getPaths()
				.on( "click", onGenreClick );

			if ( genresHelper1 && genresHelper1.length != 0 || genresHelper2 && genresHelper2.length != 0 ) {
				that.highlightArtist();
			}
			if ( highlightedGenreP1 || highlightedGenreP2 ) {
				that.highlightGenre();
			}
			if ( decade1 || decade2 ) {
				that.highlightDecade();
			}
		}
		if ( artistsGraph ) {
			artistsGraph.remove();
			artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
			artistsGraph.getPaths()
				.on( "click", onArtistClick );
			if ( highlightedArtistP1 || highlightedArtistP2 ) {
				that.highlightArtist();
			}
			if ( artistsHelper1 && artistsHelper1.length != 0 || artistsHelper2 && artistsHelper2 != 0 ) {
				that.highlightGenre();
			}
			if ( decade1 || decade2 ) {
				that.highlightDecade();
			}

		}
		if ( singleArtistGraph ) {
			var color = singleArtistGraph.getColor();
			var artistData = singleArtistGraph.getData();
			var title = singleArtistGraph.getKey();
			singleArtistGraph.remove();
			singleArtistGraph = new SingleTimelineGraph( where, artistData, color, artistsGraphTitle + " - " + title );
		}
		if ( singleGenreGraph ) {
			var color = singleGenreGraph.getColor();
			var genreData = singleGenreGraph.getData();
			var title = singleGenreGraph.getKey();
			singleGenreGraph.remove();
			singleGenreGraph = new SingleTimelineGraph( where, genreData, color, genresGraphTitle + " - " + title );
		}
    } );

	function onArtistClick ( d ) {
		var color = d.values[ 0 ].color;
		artistsGraph.remove();
		artistsGraph = null;

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", artistsClick );

		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

		singleArtistGraph = new SingleTimelineGraph( where, d, color, artistsGraphTitle + " - " + d.key );
	}

	function onGenreClick ( d ) {
		var color = d.values[ 0 ].color;
		genresGraph.remove();
		genresGraph = null;

		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", genresClick );

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" )

		singleGenreGraph = new SingleTimelineGraph( where, d, color, genresGraphTitle + " - " + d.key );

	}

	var highlightedArtistP1;

	var highlightedArtistP2;
	
	var highlightedGenreP1;

	var highlightedGenreP2;	

	var genresHelper1;

	var genresHelper2;

	var artistsHelper1;

	var artistsHelper2;

	this.removeHighlight = function ( player ) {

		if ( player == 1 ) {
			highlightedArtistP1 = null;
			highlightedGenreP1 = null;
			decade1 = null;
			artistsHelper1 = [];
			genresHelper1 = [];

			if ( !( highlightedArtistP2 || highlightedGenreP2 || decade2 ) ) {
				if ( artistsGraph ) {
					artistsGraph.remove();
					artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
					artistsGraph.getPaths()
						.on( "click", onArtistClick );
				}
				if ( genresGraph ) {
					genresGraph.remove();
					genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle  );
					genresGraph.getPaths()
						.on( "click", onGenreClick);
				}
				return;

			}

		} else if ( player == 2 ) {
			highlightedArtistP2 = null;
			highlightedGenreP2 = null;
			decade2 = null;
			artistsHelper2 = [];
			genresHelper1 = [];

			if ( !( highlightedArtistP1 || highlightedGenreP1 || decade1 ) ) {
				if ( artistsGraph ) {
					artistsGraph.remove();
					artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
					artistsGraph.getPaths()
						.on( "click", onArtistClick );
				}
				if ( genresGraph ) {
					genresGraph.remove();
					genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle  );
					genresGraph.getPaths()
						.on( "click", onGenreClick);
				}
				return;
			}
		}
		that.highlightGenre();
		that.highlightArtist();
	}


	this.highlightArtist = function ( what, player ) {


		if ( what ) {
			if ( player == 1 ) {
				highlightedArtistP1 = what;
				highlightedGenreP1 = null;
				artistsHelper1 = [];
				decade1 = null;
			} else if ( player == 2 ) {
				highlightedArtistP2 = what;
				highlightedGenreP2 = null;
				artistsHelper2 = [];
				decade2 = null;
			}
		}

		var genres1 = [];
		var genres2 = [];
		var count = 0;

		for ( var i in topArtists ) {
			var art = topArtists[ i ];
			if 	( art.name == highlightedArtistP1 ) {
				for ( var j in art.genres ) {
					genres1.push( art.genres[ j ].name.toLowerCase() );
				}
				count += 1;
			}
			if ( art.name == highlightedArtistP2 ) {
				for ( var j in art.genres ) {
					genres2.push( art.genres[ j ].name.toLowerCase() );
				}
				count += 1;
			}
			if ( count > 1 ) {
				break;
			}
		}

		genresHelper1 = genres1;
		genresHelper2 = genres2;



		if ( artistsGraph ) {
			var paths = artistsGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() )
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() )
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() )
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() )
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						onArtistClick( d );
					}
					return null;
				} );

		} else if ( genresGraph ) {

			var paths = genresGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( _.contains( genres1, d.key.toLowerCase() ) || _.contains( genres2, d.key.toLowerCase() ) 
						|| highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( _.contains( genres1, d.key.toLowerCase() ) || _.contains( genres2, d.key.toLowerCase() ) 
						|| highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( _.contains( genres1, d.key.toLowerCase() ) || _.contains( genres2, d.key.toLowerCase() ) 
						|| highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( _.contains( genres1, d.key.toLowerCase() ) || _.contains( genres2, d.key.toLowerCase() ) 
						|| highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						onGenreClick( d );
					}
					return null;
				} );
		}
	}


	this.highlightGenre = function ( what, player ) {


		if ( what ) {
			if ( player == 1 ) {
				highlightedGenreP1 = what;
				highlightedArtistP1 = null;
				genresHelper1 = [];
				decade1 = null;
			} else if ( player == 2 ) {
				highlightedGenreP2 = what;
				highlightedArtistP2 = null;
				genresHelper2 = [];
				decade2 = null;
			}
		}

		that.highlightArtist();

		var artists1 = [];
		var artists2 = [];

		var h1 = highlightedGenreP1 ? highlightedGenreP1.toLowerCase() : null;
		var h2 = highlightedGenreP2 ? highlightedGenreP2.toLowerCase() : null;

		for ( var i in topArtists ) {
			var art = topArtists[ i ];
			for ( var j in art.genres ) {

				if ( art.genres[ j ].name == h1 ) {
					artists1.push( art.name.toLowerCase() );
				}
				if ( art.genres[ j ].name == h2 ) {
					artists2.push( art.name.toLowerCase() );
				}
			}
		}

		artistsHelper1 = artists1;
		artistsHelper2 = artists2;


		if ( genresGraph ) {

			var paths = genresGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() ) 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() ) 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						|| _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() ) 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
						||  _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() ) 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						onGenreClick( d );
					}
					return null;
				} );

		} else if ( artistsGraph ) {

			var paths = artistsGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( _.contains( artists1, d.key.toLowerCase() ) || _.contains( artists2, d.key.toLowerCase() ) 
						|| highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( _.contains( artists1, d.key.toLowerCase() ) || _.contains( artists2, d.key.toLowerCase() ) 
						|| highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( _.contains( artists1, d.key.toLowerCase() ) || _.contains( artists2, d.key.toLowerCase() ) 
						|| highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( _.contains( artists1, d.key.toLowerCase() ) || _.contains( artists2, d.key.toLowerCase() ) 
						|| highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
						|| d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) {
						onArtistClick( d );
					}
					return null;
				} );
		}
	}

	var decade1;

	var decade2;

	this.highlightDecade = function ( what, player ) {

		if ( what ) {
			if ( player == 1 ) {
				decade1 = what;
				highlightedArtistP1 = null;
				artistsHelper1 = [];
				highlightedGenreP1 = null;
				genresHelper1 = [];
			} else if ( player == 2 ) {
				decade2 = what;
				highlightedArtistP2 = null;
				artistsHelper2 = [];
				highlightedGenreP2 = null;
				genresHelper2 = [];
			}
		}

		that.highlightArtist();
		that.highlightGenre();

	}

	var datearray = [];

	function highlightedMousemove ( d, i ) {

		var tooltip;
		var x;

		if ( artistsGraph ) {
			tooltip = artistsGraph.tooltip;
			x = artistsGraph.x;
			if (  !( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ||
				 _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() ) ||
				 d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) ) {
				return;
			}
		}
		if ( genresGraph ) {
			tooltip =  genresGraph.tooltip;
			x = genresGraph.x;
			if ( !( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key || 
				 _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() ) || 
				 d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) ) {
				return;
			}
		}

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
	    .classed( "hover", true );

	    invertedx = 1900 + invertedx;

	    tooltip.html( "<p>" + d.key + "<br>" + invertedx + "<br>" + pro + "</p>" ).style( "visibility", "visible" );
  	}

  	function highlightedMouseout ( d, i ) {

  		var tooltip;
  		var graph;

  		if ( artistsGraph ) {
  			tooltip = artistsGraph.tooltip;
  			graph = artistsGraph.getPaths();
  			if (  !( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key 
  				|| _.contains( artistsHelper1, d.key.toLowerCase() ) || _.contains( artistsHelper2, d.key.toLowerCase() ) ||
  				d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) ) {
				return;
			}
  		}
  		if ( genresGraph ) {
			tooltip =  genresGraph.tooltip;
			graph = genresGraph.getPaths();
			if ( !( highlightedGenreP1 == d.key || highlightedGenreP2 == d.key 
				|| _.contains( genresHelper1, d.key.toLowerCase() ) || _.contains( genresHelper2, d.key.toLowerCase() )  || 
				d.values[ 0 ].decade == decade1 || d.values[ 0 ].decade == decade2 ) ) {
				return;
			}
		}

	   	graph.selectAll( ".static-timeline-path" )
	    	.transition()
	    	.duration( 250 )
	    	.attr( "opacity", "1" );
		d3.select( this )
	    	.classed( "hover", false )
	    	//.attr( "stroke-width", "0px" );

	    tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style( "visibility", "hidden" );
	}

}
