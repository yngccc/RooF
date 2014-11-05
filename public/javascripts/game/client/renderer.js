Factory.classes['RenderEngine'] = (function() {
    var RenderEngine = Class.extend({
	canvas : null,
	context : null,
	
	viewport : {
	    x : 0,
	    y : 0,
	    w : 0,
	    h : 0
	},

	init : function() {
	    this.canvas = document.getElementById('game-canvas');

	    this.canvas.width = this.canvas.offsetWidth;
	    this.canvas.height = this.canvas.offsetHeight;
	    this.viewport.w = this.canvas.width;
	    this.viewport.h = this.canvas.height;
	    
	    this.context = this.canvas.getContext('2d');
	},

	render : function() {
	    MapEngine.draw(this.viewport);
	    Player.draw();
	},


	moveViewport : function(dx, dy) {
	    this.viewport.x += dx;
	    this.viewport.y += dy;

	    // adjustment for world out of bound cases
	    if (this.viewport.x <= 0)
		this.viewport.x = 0;
	    if(this.viewport.x + this.viewport.w >= MapEngine.pixelSize.x)
		this.viewport.x = MapEngine.pixelSize.x - this.viewport.w;
	    if(this.viewport.y <= 0)
		this.viewport.y = 0;
	    if(this.viewport.y + this.viewport.h >= MapEngine.pixelSize.y)
		this.viewport.y = MapEngine.pixelSize.y - this.viewport.h;
	}
	
    });

    return RenderEngine;

})();
