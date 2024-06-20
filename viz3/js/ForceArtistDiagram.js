var defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Avatar_Picol_icon.svg/2000px-Avatar_Picol_icon.svg.png"


var ForceArtistDiagram = function (where,static) {

	var that = this;

	this.usingAvatar=true;

	this.artists = [];
  this.genres = [];
  this.clusters = [];//name: nodes: links: expanded: when not expanded remove nodes from force and create the agglomerate, changing the links
  clusterIdCounter = 0;

  this.config = {avatarSize:90};

  this.container = d3.select(where);

  this.numberOfArtists = 0;

  this.svgW = 1000;
  this.svgH = 1000;
  this.padding = 1.5;

  this.maxRadius = this.config.avatarSize;

  this.svg = this.container.append("svg").style("width","100%").style("height","100%")
  .attr("viewBox","0 0 "+this.svgW+" "+this.svgH);

  if (static == "static") {
    this.svg.attr("viewBox","-1000 -1000 "+3000+" "+3000);  
  }

  this.defs = this.svg.append("svg:defs");

  var grad = this.defs.append("defs").append("linearGradient").attr("id", "both")
  .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
  grad.append("stop").attr("offset", "50%").style("stop-color", dynamicTimelineColorBlue);
  grad.append("stop").attr("offset", "50%").style("stop-color", dynamicTimelineColorRed);

  that.fill = d3.scale.category10();


  this.collide = function (alpha) {
    var quadtree = d3.geom.quadtree(that.nodes);
    return function(d) {
     var r = d.radius + that.maxRadius + that.padding,
     nx1 = d.x - r,
     nx2 = d.x + r,
     ny1 = d.y - r,
     ny2 = d.y + r;
     quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
       var x = d.x - quad.point.x,
       y = d.y - quad.point.y,
       l = Math.sqrt(x * x + y * y),
       r = d.radius + quad.point.radius + that.padding;
       if (l < r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  });
   }
 };


 this.tick = function() {
  that.link
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

  that.node.each(that.collide(0.5))
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
};


this.force = d3.layout.force()
.size([this.svgW, this.svgH])
.nodes(this.artists)
.linkDistance(this.config.avatarSize*2+this.padding)
.charge(-800)
.gravity(0.07)
.on("tick", this.tick)
.start();

this.nodes = this.force.nodes();
this.links = this.force.links();
this.node = this.svg.selectAll(".node");
this.link = this.svg.selectAll(".link");

};

ForceArtistDiagram.prototype.restart = function () {
  var that = this;
  //var fill = d3.scale.category20();



  this.link = this.link.data(this.links);

  this.link.enter().insert("line", ".node")
  .attr("class", "link");

  this.link.exit().remove();

	//console.log(this.nodes);

	this.node = this.node.data(this.nodes);

	this.node.exit().remove();

	// Nodes to Modify

	var g = this.node
	.attr("class", "node")
	;

  // UPDATE (ricordarsi di riprendere tutti i parametri dai dati, perchè se qualcosa ha fatto la exit gli elementi hanno i vecchi attributi ma magari sono assegnati a nuovi dati)
  g.select("circle")
  .attr('id', function(d) { return d.type; })
  .attr("class",function(d) {
    //console.log(d.player);
    return d.player;})
  .style("fill", this.usingAvatar?function(d) {
    if(d.type == 'artist') {
      return "url(#"+d.id+")";
    } else {
      if(d.bundled == false) {
        return "grey";
      } else {
        return that.fill(d.clusterId);
      }
    }
  }
  :null)
  .attr("r", function(d) {
    return d.radius;
  });

  g.select("text")
  .text(function(d){ return d.name;});


	// New Nodes
	var g = this.node.enter().append("g")
	.attr("class", "node")
	.call(this.force.drag);

	g.append("circle")
  .attr('id', function(d) { return d.type})
  .attr("class",function(d) { return d.player})
  .style("fill", this.usingAvatar?function(d) { return "url(#"+d.id+")"}:null)
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", function(d) {
    return d.radius;
  })
  .on('click', function(d) {
    if(d.type == 'genre') {
      for(var clusterIndex in that.clusters) {
        for(var nodeIndex in that.clusters[clusterIndex].nodes) { // SAREBBE MEGLIO SCRIVERE AI NODI A CHE CLUSTER APPARTENGONO PIUTTOSTO CHE FARE QUESTO CASINO
          if(that.clusters[clusterIndex].nodes[nodeIndex].name == d.name) {
            for(var colorNodeIndex in that.clusters[clusterIndex].nodes) {
              if(that.clusters[clusterIndex].nodes[colorNodeIndex].bundled == false) {
                that.clusters[clusterIndex].nodes[colorNodeIndex].bundled = true;
              } else {
                that.clusters[clusterIndex].nodes[colorNodeIndex].bundled = false;
              }
            }
            d3.selectAll('#genre').style('fill', function(d) {
              //console.log(d);
              if(d.type == 'genre') {
                if(d.bundled == false) {
                  return "grey";
                } else {
                  return that.fill(d.clusterId);
                }
              }
            });
            break;
          }
        }
      }
    }
  });

g.append("text")
.attr("class","avatar-text")
.attr("y",this.config.avatarSize/2+this.padding)
.attr("text-anchor","middle")
.attr("dominant-baseline","hanging")
.text(function(d){ return d.name});


this.force.start();
}


ForceArtistDiagram.prototype.removeArtist = function(artist,p) {
  var that = this;

	var alreadyThere = false;
	var oldNode;
  var oldNodeIndex;
  for (var i in this.nodes){
    var n = this.nodes[i];
    if (n.id == artist.id){
     alreadyThere=true;
     oldNode = n;
     oldNodeIndex = i;
   }
 }

 if (alreadyThere) {
  if (oldNode.player.indexOf("player" + p)!=-1) {
   var start = oldNode.player.indexOf("player" + p)==0?8:0
   var end = oldNode.player.indexOf("player" + p)==0?15:7
   oldNode.player = oldNode.player.slice(start,end);

   if (oldNode.player.length==0) {
          // Remove links to the node
          var j=0;
          while (j<this.links.length) {
            var l = this.links[j];
            if (l.source==oldNode || l.target==oldNode) {
              this.links.splice(j,1);
            } else {
              j += 1;
            }
          }

        // Remove left unlinked genres
        for(var genreIndex in oldNode.genres) {
          var unlinkedGenre = true;
          for(var linkIndex in this.links) {
            //console.log(this.links[linkIndex].source.name);
            //console.log(this.links[linkIndex].target.name);
            if(this.links[linkIndex].source.name == oldNode.genres[genreIndex].name || this.links[linkIndex].target.name == oldNode.genres[genreIndex].name) {
              unlinkedGenre = false;
              break;
            }
          }
          if(unlinkedGenre) {
            var oldGenreNodeIndex;
            var belongingClusterId = -1;
            for(i in this.nodes) {
              if(this.nodes[i].name == oldNode.genres[genreIndex].name) {
                oldGenreNodeIndex = i;
                belongingClusterId = this.nodes[i].clusterId;
                break;
              }
            }
            // IMP.! REMOVE NODE FROM THE CLUSTER!
            for(i in that.clusters) {
              if(that.clusters[i].clusterId == belongingClusterId) {
                for (j in that.clusters[i].nodes) {
                  if(that.clusters[i].nodes[j].name == oldNode.genres[genreIndex].name) {
                    that.clusters[i].count--;
                    that.clusters[i].nodes.splice(j,1);
                  }
                }
              }
            }

            //Remove genre node
            that.genres.splice(that.genres.indexOf(oldNode.genres[genreIndex]),1); //remove from genre array
            this.nodes.splice(oldGenreNodeIndex,1);

            // PENSARE SE RIMUOVER ANCHE I CLUSTERS CHE NON ESISTONO PIÙ
          }
        }

        // Remove the node (i have to recompute the oldNodeIndex cause can be changed removing genre nodes)
        // PER UN PROGETTO PIÙ SERIO FARE DUE ARRAY DI NODI CON SEMANTICA DIVERSA SEPARATI, O METTERE UN SEPARATORE IN QUALCHE MODO
        for (i in this.nodes){
          if (this.nodes[i].id == artist.id){
           oldNodeIndex = i;
           break;
         }
       }
       this.nodes.splice(oldNodeIndex,1);

       this.restart();
     } else {
				// Only change class (qua ricolora tutto, quando programmo bene ricolorare solo nodo cambiato)
				this.node.select("circle").attr("class", function(d){ return d.player; })
        .style("fill", this.usingAvatar?function(d) {
          if(d.type == 'artist') {
            return "url(#"+d.id+")";
          } else {
            if(d.bundled == false) {
              return "grey";
            } else {
              return that.fill(clusterId);
            }
          }
        }
        :null);
        //.style("fill", this.usingAvatar?function(d) { return "url(#"+d.id+")"; }:null);
      }
    }

  }

  // QUANDO RIMUOVO ARTISTA, FARE CONTROLLO SE I SUOI GROUPNODES NON HANNO PIÙ LINK, IN TAL CASO, RIMUOVERLI

};


ForceArtistDiagram.prototype.addArtist = function(artist,p) {
this.numberOfArtists++;

  var that = this;

	var artistNode = artist;

	//console.log(artistNode);

	var alreadyThere = false;
	var oldNode;
	for (var i in this.nodes){
		var n = this.nodes[i];
		if (n.id == artist.id){
			alreadyThere=true;
			oldNode = n;
		}
	}

	if (!alreadyThere){
    var badLink= "http://userserve-ak.last.fm/";
    var avatar = null;
    for (i in artist.images){
     var url = artist.images[0]["url"];
     if (url.indexOf(badLink) == -1){
      avatar = url;
      break;
    }
  }


  this.defs.append("svg:pattern")
  .attr("id", artist.id)

  .attr("width", "100%")
  .attr("height", "100%")
  .attr("patternContentUnits", "objectBoundingBox")
  .append("svg:image")
  .attr("xlink:href", avatar?avatar:defaultAvatar)
  .attr("width", 1)
  .attr("height", 1)
  .attr("preserveAspectRatio","none");

  artistNode.type = 'artist';
  artistNode.x = Math.random()*this.svgW;
  artistNode.y = Math.random()*this.svgH;
  artistNode.radius = this.config.avatarSize/2;
  artistNode.player = "player" + p;
  //console.log(artistNode);

  this.nodes.push(artistNode);

/* ADD LINKS BETWEEN ARTISTS
  for (var i in this.nodes){
    var a2 = this.nodes[i];
    if (areSimilar(a2,artist)){
      this.links.push({source:artistNode,target:a2});
    }
  }
  */

    //var newGenres = [];
    // Searching for new genres
    for (var h in artistNode.genres) {
      //console.log('incycle');
      var existingGenre = false;
      for(var j in that.genres) {
        if (that.genres[j].name == artistNode.genres[h].name) {
          existingGenre = true;
        }
      }
      if(!existingGenre) {
        this.addGenre(artistNode.genres[h]); //ricordarsi di aggiungere il genre nel vettore dei genres attraverso la funzione
      }
    }

    // Searching for new links with existing genres
    for(i in artist.genres) {
      for (j in this.nodes) {
        if(this.nodes[j].type == 'genre') {
          if(artist.genres[i].name == this.nodes[j].name) {
            this.links.push({source:this.nodes[j],target:artist});
          }
        }
      }
    }
    //console.log(this.links);




    this.restart();
  }else {
    if (oldNode.player.indexOf("player" + p)==-1) {
     oldNode.player += " player" + p;
     this.node.selectAll("circle").attr("class", function(d){ return d.player });
   }
 }
}

ForceArtistDiagram.prototype.addGenre = function(newGenre) {
  // QUANDO METTO GENERE CHE C'È GIÀ ME LO AGGIUNGE COMUNQUE DA QUALCHE PARTE
  // OPPURE DA QUALCHE PARTE NON RIMUOVO DA VETTORE GENERE, O AGGIUNGO DUE VOLTE A VETTORE GENERE
  var that = this;

  var genreNode = newGenre;

  that.genres.push(newGenre);

 /* var badLink= "http://userserve-ak.last.fm/";
  var avatar = null;
  for (i in artist.images){
   var url = artist.images[0]["url"];
   if (url.indexOf(badLink) == -1){
    avatar = url;
    break;
  }
}*/

this.defs.append("svg:pattern")
//.attr("id", artist.id)
.attr("width", "100%")
.attr("height", "100%")
.attr("patternContentUnits", "objectBoundingBox")
.append("svg:image")
.attr("xlink:href", defaultAvatar)
.attr("width", 1)
.attr("height", 1)
.attr("preserveAspectRatio","none");

genreNode.type = 'genre';
genreNode.x = Math.random()*this.svgW;
genreNode.y = Math.random()*this.svgH;
genreNode.radius = this.config.avatarSize/6;
genreNode.clusterId = -1;
genreNode.clustered = false;
genreNode.bundled = false;
		//genreNode.player = "player" + p;
		this.nodes.push(genreNode);


    // After the new genre node is added, compute links with similar genres
    // USE FORCE HELPER
    //var clustered = false;
    for (var i in that.clusters) {
      if(genreNode.name.indexOf(that.clusters[i].name) > -1) {
        //console.log('inWrong');
        genreNode.clusterId = that.clusters[i].clusterId;
        that.clusters[i].nodes.push(genreNode);
        that.clusters[i].count++;
        genreNode.clustered = true;
        if(that.clusters[i].nodes[0].bundled) {
          genreNode.bundled = true;
        } else {
          genreNode.bundled = false;
        }
        //clustered = true;
        break;
        //aggiungere anche links
      }
    }
    if (!genreNode.clustered) {
      var tempClustered;
      var tempClusters = [];
      for (i in this.nodes) {
        if(this.nodes[i].type == 'genre') {
          if(this.nodes[i].clustered == false) {
            tempClustered = false;
            //console.log('inClusteredFalse');
            var comparedGenreNode = this.nodes[i];
            var clusterName = stringIntersection2(comparedGenreNode.name, genreNode.name);
            if(clusterName != '') {
              for (var j in tempClusters) {
                if(clusterName == tempClusters[j].name) {
                  var present = false;
                  for(var h in tempClusters[j].nodes) {
                    if(tempClusters[j].nodes[h].name == genreNode.name) {
                      present = true;
                      break;
                    }
                  }
                  if (!genreNode.clustered && !present) {
                    tempClusters[j].nodes.push(genreNode);
                    tempClusters[j].count++;
                    genreNode.clustered = true;
                    if(tempClusters[j].nodes[0].bundled) {
                      genreNode.bundled = true;
                    } else {
                      genreNode.bundled = false;
                    }
                  }
                  present = false;
                  for(var h in tempClusters[j].nodes) {
                    if(tempClusters[j].nodes[h].name == comparedGenreNode.name) {
                      present = true;
                      break;
                    }
                  }
                  if(!present) {
                    tempClusters[j].nodes.push(comparedGenreNode);
                    tempClusters[j].count++;
                    comparedGenreNode.clustered = true;
                  }
                  tempClustered = true;
                  break;
                }
              }
              if(!tempClustered) {
              //console.log('inNotTempClustered');
              //crea il cluster con nome clusterName;
              comparedGenreNode.clustered = true;
              var newCluster = {'clusterId': -1, 'name': clusterName, 'nodes': [comparedGenreNode], 'count': 1};
              tempClusters.push(newCluster);
              //tempClustered = true;
            }
            /*if (similarGenres(a.name, genreNode.name)){
              this.links.push({source:genreNode,target:a});
            }*/
          }
        }
      }
    }
    for(c in tempClusters) {
      if(tempClusters[c].count > 1) {
        tempClusters[c].clusterId = clusterIdCounter;
        for (nodeIndex in tempClusters[c].nodes) {
          tempClusters[c].nodes[nodeIndex].clusterId = clusterIdCounter;
        }
        clusterIdCounter++;
        that.clusters.push(tempClusters[c]);
      } else {
          // *METTERE CLUSTERED = FALSE A TUTTI I NODI DEL TEMPCLUSTER NON DIVENTATO CLUSTER*
          // E TOGLIERE BUNDLES
          for(n in tempClusters[c].nodes) {
            tempClusters[c].nodes[n].clustered = false;
          }
        }
      }
    }

    this.restart();

  };



