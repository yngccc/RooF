define([
    "util/gl-matrix"
], function () {
    "use strict";

    //simple top down camera use in RTS game    
    var camera = function(canvas) {
	this.canvas = canvas;
	this.viewMat = null;

	this.moving = false;
	
	this.newX = 0;
	this.newY = 0;
	this.newZ = 0;
	this.oldX = 0;
	this.oldY = 0;
	this.oldZ = 0;

	this.increment = 10;
	
	this.rect = this.canvas.getBoundingClientRect();
	this.root = document.documentElement;
    };
    
    camera.prototype.setup = function() {
	var that = this;
	
	this.viewMat = mat4.lookAt(vec3.create([100,200,0]), vec3.create([0,0,0]), vec3.create([0,1,0]));
	
	document.addEventListener("keydown", function(event) {
	    switch (event.which) {
	    case 87 : // w
		if (that.newX < 500)
		    that.newX -= that.increment;
		break;
	    case 83 : // s
		if (that.newX > -500)
		    that.newX += that.increment;
		break;
	    case 65 : // a
		if (that.newZ < 500)
		    that.newZ += that.increment;
		break;
	    case 68 : // d
		if (that.newZ > -500)
		    that.newZ -= that.increment;
		break;
	    default :
		break;
	    }
	});
    };
	    
    // 	this.canvas.mousedown(function(event) {
    // 	    that.moving = true;
    // 	    that.getMousePos(event);
    // 	});

    // 	this.canvas.mousemove(function(event) {
    // 	    if (that.moving) {
    // 		that.getMousePos(event);
    // 	    }
    // 	});

    // 	this.canvas.mouseup(function(event) {
    // 	    that.moving = false;
    // 	});
    // },
	    
    // camera.prototype.getMousePos = function(event) {
    //     this.currentX = event.clientX - this.rect.top - this.root.scrollTop;
    //     this.currentY = event.clientY - this.rect.left - this.root.scrollLeft;
    // },

    camera.prototype.getViewMat = function() {
	var deltaX = this.newX - this.oldX;
	var deltaY = this.newY - this.oldY;
	var deltaZ = this.newZ - this.oldZ;
	mat4.translate(this.viewMat, vec3.create([deltaX, deltaY, deltaZ]));
	this.oldX = this.newX;
	this.oldY = this.newY;
	this.oldZ = this.newZ;
	return this.viewMat;
    }
    
    return camera;
});