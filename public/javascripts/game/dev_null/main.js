require.config({
    baseUrl: "/javascripts/webgl",
    paths : {
	"glMatrix" : "vendor/gl-matrix-min"
    }
});

require(["glUtil", "renderer", "shaders"], function(glUtil, renderer, shaders) {
    "use strict";
    if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function(){
            return  window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame    || 
                    window.oRequestAnimationFrame      || 
                    window.msRequestAnimationFrame     || 
                function(callback, element){
                    window.setTimeout(function() {
                        callback(new Date().getTime());
                    }, 1000 / 60);
                };
        })();
    }

    var canvas = document.getElementById("canvas");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var fpsCounter = document.getElementById("fps");

    var gl = glUtil.getContext(canvas);
    window.program = glUtil.createProgram(gl, shaders.simpleVert, shaders.simpleFrag);
    glUtil.setLocations(gl, window.program, ["position"], ["viewMat", "projMat"]);
    gl.useProgram(window.program);

    var renderer = new renderer(gl, canvas);
    renderer.resize(gl, canvas);
    
    glUtil.startRenderLoop(gl, canvas, function(gl, timing) {
	fpsCounter.innerHTML = timing.framesPerSecond;
        renderer.drawFrame(gl, timing);
    });

});