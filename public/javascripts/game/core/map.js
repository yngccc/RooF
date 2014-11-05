Factory.classes['MapEngine'] = (function() {
    var MapEngine = Class.extend({
	mapData : null,
	tileSets: [],

	numXTiles : 0,
	numYTiles : 0,

	tileSize : {
	    x : 0,
	    y : 0
	},

	pixelSize : {
	    x : 0,
	    y : 0
	},

	preCacheCanvasArray : null,

	numImg : 0,
	numImgLoaded : 0,

	init : function() {},

	load: function (map) {
	    this.mapData = map;
	    this.numXTiles = map.width;
	    this.numYTiles = map.height;
	    this.tileSize.x = map.tilewidth;
	    this.tileSize.y = map.tileheight;
	    this.pixelSize.x = this.numXTiles * this.tileSize.x;
	    this.pixelSize.y = this.numYTiles * this.tileSize.y;
	    this.numImg = map.tilesets.length;

	    // in this case only 1 tileSet
	    for (var i = 0; i < map.tilesets.length; i++) {
		var ts = {
		    "firstgid" : map.tilesets[i].firstgid,
		    // what about multiple map images??
		    "image" : GameAssets.map,
		    "imageheight" : map.tilesets[i].imageheight,
		    "imagewidth" : map.tilesets[i].imagewidth,
		    "name" : map.tilesets[i].name,
		    "numXTiles" : Math.floor(map.tilesets[i].imagewidth / this.tileSize.x),
		    "numYTiles" : Math.floor(map.tilesets[i].imageheight / this.tileSize.y)
		};
		
		this.tileSets.push(ts);
	    }

	    // load collision information
	    for (var layerIdx = 0; layerIdx < this.mapData.layers.length; layerIdx++) {
	    	if (this.mapData.layers[layerIdx].type === "objectgroup") {
	    	    var layer = this.mapData.layers[layerIdx];
	    	    var name = layer.name;
	    	    if (name === "collision") {
	    		//for each object, make a collision object
	    		for (var objIdx = 0; objIdx < layer.objects.length; objIdx++) {
	    		    var obj = layer.objects[objIdx];
			    
	    		    var collidesWithArray = new Array();
	    		    var collisionTypeArray = new Array();
			    
	    		    if(obj.properties['collisionFlags']) {
	    			var flagsArray = obj.properties['collisionFlags'].split(",");
	    			for(var propIdx = 0; propIdx < flagsArray.length; propIdx++) {
	    			    if(flagsArray[propIdx] === 'projectileignore') {
	    				collisionTypeArray.push('projectileignore');
	    				collidesWithArray.push('player');
	    			    }
	    			}
	    		    }		  
			    
	    		    if(collisionTypeArray.length === 0)
	    			collisionTypeArray.push('mapobject');
			    
			    
	    		    if(collidesWithArray.length === 0)
	    			collidesWithArray.push('all');
			    
	    		    if (obj.polygon === null) {
	    			var entityDef = {
	    			    id: obj.name,
	    			    x: obj.x + (obj.width * 0.5),
	    			    y: obj.y + (obj.height * 0.5),
	    			    halfHeight: obj.height * 0.5,
	    			    halfWidth: obj.width * 0.5,
	    			    dampen: 0,
	    			    angle: 0,
	    			    type: 'static',
	    			    categories: collisionTypeArray,
	    			    collidesWith: collidesWithArray,
	    			    userData: {
	    				"id": obj.name
	    			    },
	    			};
	    		    } else {
	    	    		var entityDef = {
	    			    id: obj.name,
	    			    x: obj.x + (obj.width * 0.5),
	    			    y: obj.y + (obj.height * 0.5),
	    			    dampen: 0,
	    			    angle: 0,
	    			    polyPoints: obj.polygon,
	    			    type: 'static',
	    			    categories: collisionTypeArray,
	    			    collidesWith: collidesWithArray,
	    			    userData: {
	    				"id": obj.name
	    			    },
	    			};
	    		    }
	    		    PhysicsEngine.addBody(entityDef);
	    		}
	    	    }
	    	}
	    }
	},

	getTilePacket: function (tileIndex) {
	    var pkt = {
		"img": null,
		"px": 0,
		"py": 0
	    };
	    var i = 0;
	    for (i = this.tileSets.length - 1; i >= 0; i--) {
		if (this.tileSets[i].firstgid <= tileIndex) break;
	    }

	    pkt.img = this.tileSets[i].image;
	    var localIdx = tileIndex - this.tileSets[i].firstgid;
	    var lTileX = Math.floor(localIdx % this.tileSets[i].numXTiles);
	    var lTileY = Math.floor(localIdx / this.tileSets[i].numXTiles);
	    pkt.px = (lTileX * this.tileSize.x);
	    pkt.py = (lTileY * this.tileSize.y);

	    return pkt;
	},

	intersectRect : function (r1, r2) {
	    return !(r2.left > r1.right || 
		     r2.right < r1.left || 
		     r2.top > r1.bottom ||
		     r2.bottom < r1.top);
	},

	preDrawCache : function() {
	    var divSize = 1024;
	    this.preCacheCanvasArray = new Array();
	    var xCanvasCount = 1 + Math.floor(this.pixelSize.x / divSize);
	    var yCanvasCount = 1 + Math.floor(this.pixelSize.y / divSize);
	    var numSubCanv = xCanvasCount*yCanvasCount;
	    
	    for(var yC = 0; yC <yCanvasCount; yC ++)
	    {
		for(var xC = 0; xC <xCanvasCount; xC ++)
		{
		    var k = {
			x:xC * divSize,
			y:yC * divSize,
			w:Math.min(divSize, this.pixelSize.x),
			h:Math.min(divSize, this.pixelSize.y),
			preCacheCanvas:null};
		    
		    var can2 = document.createElement('canvas');
		    can2.width = k.w;
		    can2.height = k.h;

		    k.preCacheCanvas = can2;
		    this.preCacheCanvasArray.push(k);
		}
	    }
	    
	    for(var cc = 0; cc < this.preCacheCanvasArray.length; cc++)
	    {
		var can2 = this.preCacheCanvasArray[cc].preCacheCanvas;
		
		var ctx = can2.getContext('2d');
		
		ctx.fillRect(0,0,this.preCacheCanvasArray[cc].w, this.preCacheCanvasArray[cc].h);
		var vRect={	top:this.preCacheCanvasArray[cc].y,
				left:this.preCacheCanvasArray[cc].x,
				bottom:this.preCacheCanvasArray[cc].y+this.preCacheCanvasArray[cc].h,
				right:this.preCacheCanvasArray[cc].x+this.preCacheCanvasArray[cc].w};
		
		for (var layerIdx = 0; layerIdx < this.mapData.layers.length; layerIdx++) 
		{
		    if (this.mapData.layers[layerIdx].type != "tilelayer") continue;

		    var dat = this.mapData.layers[layerIdx].data;
		    //find what the tileIndexOffset is for this layer
		    for (var tileIDX = 0; tileIDX < dat.length; tileIDX++) {
			var tID = dat[tileIDX];
			if (tID === 0) continue;

			var tPKT = this.getTilePacket(tID);

			//test if this tile is within our world bounds
			var worldX = Math.floor(tileIDX % this.numXTiles) * this.tileSize.x;
			var worldY = Math.floor(tileIDX / this.numXTiles) * this.tileSize.y;

			var visible= this.intersectRect(	vRect,
								{top:worldY,left:worldX,bottom:worldY + this.tileSize.y,right:worldX + this.tileSize.x});
			if(!visible)	
			    continue;
			
			// Nine arguments: the element, source (x,y) coordinates, source width and 
			// height (for cropping), destination (x,y) coordinates, and destination width 
			// and height (resize).
			//		ctx.fillRect(worldX,worldY,this.tileSize.x, this.tileSize.y);
			
			ctx.drawImage(tPKT.img,
				      tPKT.px, tPKT.py, 
				      this.tileSize.x, this.tileSize.y, 
				      worldX - vRect.left, 
				      worldY - vRect.top, 
				      this.tileSize.x, this.tileSize.y);
			
			

		    }
		}
		this.preCacheCanvas = can2;
	    }
	    
	}
	
    });

    return MapEngine;

})();

