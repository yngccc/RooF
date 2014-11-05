define(["camera", "glUtil", "model", "glMatrix"], function(camera, glUtil, model) {
    "use strict";
    var renderer = function(gl, canvas) {
	this.camera = new camera.ModelCamera(canvas);
        this.camera.distance = 42;

	this.model = new model.Model(gl);

        this.fov = 45;
        this.projectionMat = mat4.create();
        mat4.perspective(this.fov, canvas.width/canvas.height, 1, 5000, this.projectionMat);
	
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    };
    
    renderer.prototype.resize = function (gl, canvas) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        mat4.perspective(this.fov, canvas.width/canvas.height, 1.0, 4096.0, this.projectionMat);
    };
    
    renderer.prototype.drawFrame = function (gl, timing) {
        this.camera.update(timing.frameTime);
	
        var viewMat = this.camera.getViewMat();
        var projectionMat = this.projectionMat;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	this.model.draw(gl, viewMat, projectionMat);
    };
    
    return renderer;

});



