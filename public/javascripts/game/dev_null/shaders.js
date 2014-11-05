define(function() {
    return {
	simpleVert : [
	    "attribute vec3 position;",
	    "uniform mat4 viewMat;",
	    "uniform mat4 projMat;",
	    "void main() {",
	    "gl_Position = viewMat*projMat*vec4(position, 1.0);",
            "}"].join('\n'),
	simpleFrag : [
	    "precision mediump float;",
	    "void main() {",
	    "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
	    "}"].join('\n')
    };
});