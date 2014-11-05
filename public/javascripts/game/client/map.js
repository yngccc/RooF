Factory.classes['ClientMapEngine'] = (function() {
    var MapEngine = Factory.getClass('MapEngine');

    var ClientMapEngine = MapEngine.extend({
	draw : function (viewport) { 
	    if(this.preCacheCanvasArray !== null) {
		var r2 = viewport;
		//aabb test to see if our view-rect intersects with this canvas.
		for(var q =0; q < this.preCacheCanvasArray.length; q++)
		{
		    var r1 = this.preCacheCanvasArray[q];
		    var visible= this.intersectRect(	{top:r1.y,left:r1.x,bottom:r1.y+r1.h,right:r2.x+r2.w},
							{top:r2.y,left:r2.x,bottom:r2.y+r2.h,right:r2.x+r2.w});
		    
		    if(visible)
			RenderEngine.context.drawImage(r1.preCacheCanvas, r1.x-viewport.x,r1.y-viewport.y);
		}
		return;
	    }
	    
	    for (var l = 0; l < this.mapData.layers.length; l++) {
		if (this.mapData.layers[l].type !== "tilelayer") continue;
		
		var data = this.mapData.layers[l].data;
		for (var i = 0; i < data.length; i++) {
		    var tileNum = data[i];
		    if (tileNum === 0) continue;

		    var packet = this.getTilePacket(tileNum);
		    //test if this tile is within world bounds
		    var worldX = Math.floor(i % this.numXTiles) * this.tileSize.x;
		    var worldY = Math.floor(i / this.numXTiles) * this.tileSize.y;
		    if ((worldX + this.tileSize.x) < viewport.x ||
			(worldY + this.tileSize.y) < viewport.y ||
			worldX > (viewport.x + viewport.w) ||
			worldY > (viewport.y + viewport.h)) { continue; }

		    //adjust all the visible tiles to draw at canvas origin.
		    worldX -= viewport.x;
		    worldY -= viewport.y;
		    
		    var context = RenderEngine.context;
		    context.drawImage(packet.img, packet.px, packet.py, this.tileSize.x, this.tileSize.y, worldX, worldY, this.tileSize.x, this.tileSize.y);
		}
	    }
	}
    });

    return ClientMapEngine;

})();