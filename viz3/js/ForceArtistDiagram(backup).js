var defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Avatar_Picol_icon.svg/2000px-Avatar_Picol_icon.svg.png"


var ForceArtistDiagram = function (where) {
	var that= this;
	
	this.usingAvatar=true;
	
	this.artists = [];
	this.config = {avatarSize:90};
	
	
	this.container = d3.select(where)
	
	this.svgW = 1000;
	this.svgH = 1000;
	this.padding = 1.5;
    
    this.maxRadius = this.config.avatarSize;
	
	this.svg = this.container.append("svg").style("width","100%").style("height","100%")	
							.attr("viewBox","0 0 "+this.svgW+" "+this.svgH);
	this.defs = this.svg.append("svg:defs");
	
	var grad = this.defs.append("defs").append("linearGradient").attr("id", "both")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
	grad.append("stop").attr("offset", "50%").style("stop-color", "#779ECB");
	grad.append("stop").attr("offset", "50%").style("stop-color", "#C23B22");
		
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
	

	this.tick = function(){
		that.link.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
	
		that.node.each(that.collide(0.5))
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
							
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
    

    
}

ForceArtistDiagram.prototype.restart = function () {
	var that = this;

	this.link = this.link.data(this.links);
	
	this.link.enter().insert("line", ".node")
	  .attr("class", "link");

	this.link.exit().remove();

	this.node = this.node.data(this.nodes);

	this.node.exit().remove();

	// Nodes to Modify

	var g = this.node
			.attr("class", "node")
			;

	g.select("circle")
			.attr("class",function(d) { return d.player;})
			.style("fill", this.usingAvatar?function(d) { return "url(#"+d.id+")"}:null)

	g.select("text")
			.text(function(d){ return d.name});



	// New Nodes
	var g = this.node.enter().append("g")
		.attr("class", "node")
		.call(this.force.drag);
	
	g.append("circle")
		.attr("class",function(d) { return d.player})
		.style("fill", this.usingAvatar?function(d) { return "url(#"+d.id+")"}:null)
		.attr("cx", 0)
        .attr("cy", 0)
        .attr("r", this.config.avatarSize/2)
     
    g.append("text")
    	.attr("class","avatar-text")
    	.attr("y",this.config.avatarSize/2+this.padding)
    	.attr("text-anchor","middle")
    	.attr("dominant-baseline","hanging")
    	.text(function(d){ return d.name});


	
	this.force.start();
}

ForceArtistDiagram.prototype.removeArtist = function(artist,p) {


	var alreadyThere = false;
	var oldNode;
	for (var i in this.nodes){
		var n = this.nodes[i];
		if (n.id == artist.id){
			alreadyThere=true;
			oldNode = n;
			var oldNodeIndex = i;
		}
	}

	if (alreadyThere) {
		if (oldNode.player.indexOf("player" + p)!=-1) {
			var start = oldNode.player.indexOf("player" + p)==0?8:0
			var end = oldNode.player.indexOf("player" + p)==0?15:7
			oldNode.player = oldNode.player.slice(start,end);
			if (oldNode.player.length==0) {
				// Remove the node
				var j=0;
				while (j<this.links.length) {
					var l = this.links[j];
					if (l.source==oldNode || l.target==oldNode) {
						this.links.splice(j,1);
					} else {
						j += 1;
					}
				}

				this.nodes.splice(oldNodeIndex,1);
				this.restart();
			} else {
				// Only change class

				this.node.select("circle").attr("class", function(d){ return d.player })
						.style("fill", this.usingAvatar?function(d) { return "url(#"+d.id+")"}:null);
			}
		}

	}


}

ForceArtistDiagram.prototype.addArtist = function(artist,p) {
	var artistNode = artist;

	var alreadyThere = false;
	var oldNode;
	for (var i in this.nodes){
		var n = this.nodes[i];
		if (n.id == artist.id){
			alreadyThere=true;
			oldNode = n;
		}
	}

	if (this.nodes.length > 50) {
		this.svg.attr("viewBox","-500 -500 2000 2000");

	}

	if (!alreadyThere){
		var badLink= "http://userserve-ak.last.fm/" 
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
				.attr("preserveAspectRatio","none")
				
		
		
		artistNode.x = Math.random()*this.svgW;
		artistNode.y = Math.random()*this.svgH;
		artistNode.radius = this.config.avatarSize/2;
		artistNode.player = "player" + p;
		this.nodes.push(artistNode);
		
		for (var i in this.nodes){
			var a2 = this.nodes[i];
			if (areSimilar(a2,artist)){
				this.links.push({source:artistNode,target:a2})
			}
		}
		
		this.restart();
	}else {
		if (oldNode.player.indexOf("player" + p)==-1){
			oldNode.player += " player" + p;
			this.node.selectAll("circle").attr("class", function(d){ return d.player });
		}
	}
}




