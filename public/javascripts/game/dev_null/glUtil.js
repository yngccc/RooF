define(function() {
    return {
	getContext : function(canvas) {
	    if (canvas.getContext) {
		var context;
		try {
		    context = canvas.getContext("webgl");
		    if (context) return context;
		} catch(ex) {}
		
		try {
		    context = canvas.getContext("experimental-webgl");
		    if (context) return context;
		} catch(ex) {}
	    }
	    return null;
	},

	createProgram : function(gl, vertSrc, fragSrc) {
	    var compiled;
	    var linked;
	    
	    var vertShader = gl.createShader(gl.VERTEX_SHADER);
	    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	    gl.shaderSource(vertShader, vertSrc);
	    gl.shaderSource(fragShader, fragSrc);
	    
	    gl.compileShader(vertShader);
	    gl.compileShader(fragShader);
	    compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)
	    if (!compiled) {
		gl.deleteShader(vertShader);
		gl.deleteShader(fragShader);
		console.log("error compiling vertex shader");
		return null;
	    }
	    compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)
	    if (!compiled) {
		gl.deleteShader(vertShader);
		gl.deleteShader(fragShader);
		console.log("error compiling fragment shader");
		return null;
	    }
	    
	    var program = gl.createProgram();
	    gl.attachShader(program, vertShader);
	    gl.attachShader(program, fragShader);
	    
	    gl.linkProgram(program);
	    
	    gl.deleteShader(vertShader);
	    gl.deleteShader(fragShader);

	    linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	    if (!linked) {
		gl.deleteProgram(program);
		console.log("error linking program");
		return null;
	    }
	    return program;
	},
	
	setLocations : function(gl, program, attribs, uniforms) {
	    if (attribs) {
		program.attribute = {};
		for (var i in attribs) {
		    var a = attribs[i];
		    program.attribute[a] = gl.getAttribLocation(program, a);
		}
	    }
	    if (uniforms) {
		program.uniform = {};
		for (var i in uniforms) {
		    var u = uniforms[i];
		    program.uniform[u] = gl.getUniformLocation(program, u);
		}
	    }
	},

	createSolidTexture: function(gl, color) {
            var data = new Uint8Array(color);
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            return texture;
        },
    
        loadTexture: function(gl, src, callback) {
            var texture = gl.createTexture();
            var image = new Image();
            image.addEventListener("load", function() {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
            
                if(callback) { callback(texture); }
            });
            image.src = src;
            return texture;
        },

	startRenderLoop: function(gl, canvas, callback) {
            var startTime = window.webkitAnimationStartTime || 
                window.mozAnimationStartTime ||
                new Date().getTime();

            var lastTimeStamp = startTime;
            var lastFpsTimeStamp = startTime;
            var framesPerSecond = 0;
            var frameCount = 0;
        
            function nextFrame(time){
                window.requestAnimationFrame(nextFrame, canvas);
                
                if(time - lastFpsTimeStamp >= 1000) {
                    framesPerSecond = frameCount;
                    frameCount = 0;
                    lastFpsTimeStamp = time;
                } 

                callback(gl, {
                    startTime: startTime,
                    timeStamp: time,
                    elapsed: time - startTime,
                    frameTime: time - lastTimeStamp,
                    framesPerSecond: framesPerSecond,
                });
            
                ++frameCount;
                lastTimeStamp = time;
            };

            window.requestAnimationFrame(nextFrame, canvas);
        },

	createCube : function(gl) {
            var cubeVerts = [
			     // Front face
			     -1.0, -1.0,  1.0,
			     1.0, -1.0,  1.0,
			     1.0,  1.0,  1.0,
			     -1.0,  1.0,  1.0,
			     
			     // Back face
			     -1.0, -1.0, -1.0,
			     -1.0,  1.0, -1.0,
			     1.0,  1.0, -1.0,
			     1.0, -1.0, -1.0,
			     
			     // Top face
			     -1.0,  1.0, -1.0,
			     -1.0,  1.0,  1.0,
			     1.0,  1.0,  1.0,
			     1.0,  1.0, -1.0,
			     
			     // Bottom face
			     -1.0, -1.0, -1.0,
			     1.0, -1.0, -1.0,
			     1.0, -1.0,  1.0,
			     -1.0, -1.0,  1.0,
			     
			     // Right face
			     1.0, -1.0, -1.0,
			     1.0,  1.0, -1.0,
			     1.0,  1.0,  1.0,
			     1.0, -1.0,  1.0,
			     
			     // Left face
			     -1.0, -1.0, -1.0,
			     -1.0, -1.0,  1.0,
			     -1.0,  1.0,  1.0,
			     -1.0,  1.0, -1.0
			    ];
	    var cubeIndices = [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left
	    ];

	    var cubeVertBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVerts), gl.STATIC_DRAW);

            var cubeIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
	    return [cubeVertBuffer, cubeIndexBuffer];
	},

	_loadShader : function(url, data, callback, errorCallback) {
	    url = "javascripts/webgl/shaders/" + url;
	    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    
	    request.onreadystatechange = function () {
 		if (request.readyState == 4) {
		    if (request.status == 200) {
			callback(request.responseText, data)
		    } else {
			errorCallback(url);
		    }
		}
	    };
	    request.send(null);    
	},

	_loadShaders : function(urls, callback, errorCallback) {
	    var numUrls = urls.length;
	    var numComplete = 0;
	    var result = [];
	    
	    function partialCallback(text, urlIndex) {
		result[urlIndex] = text;
		numComplete++;
		
		if (numComplete == numUrls) {
		    callback(result);
		}
	    }
	    
	    for (var i = 0; i < numUrls; i++) {
		this._loadShader(urls[i], i, partialCallback, errorCallback);
	    }
	}
    };
});

