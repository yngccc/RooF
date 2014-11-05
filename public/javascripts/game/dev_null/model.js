define([
    "glUtil",
    "shaders",
    "glMatrix",
], function (glUtil, shaders) {
    "use strict";

    var MAX_BONES_PER_MESH = 50;

    var identityMat = mat4.create();
    mat4.identity(identityMat);

    // Vertex Format Flags
    var ModelVertexFormat = {
        Position: 0x0001,
        UV: 0x0002,
        UV2: 0x0004,
        Normal: 0x0008,
        Tangent: 0x0010,
        Color: 0x0020,
        BoneWeights: 0x0040
    };

    function GetLumpId(id) {
        var str = "";
        str += String.fromCharCode(id & 0xff);
        str += String.fromCharCode((id >> 8) & 0xff);
        str += String.fromCharCode((id >> 16) & 0xff);
        str += String.fromCharCode((id >> 24) & 0xff);
        return str;
    };

    var Model = function (gl) {
        this.vertexFormat = 0;
        this.vertexStride = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.meshes = null;
        this.complete = false;
    };

    Model.prototype.load = function (gl, url, callback) {
        var self = this,
        vertComplete = false,
        modelComplete = false;

        // Load the binary portion of the model
        var vertXhr = new XMLHttpRequest();
        vertXhr.open('GET', url + ".wglvert", true);
        vertXhr.responseType = "arraybuffer";
        vertXhr.onload = function() {
            var arrays = self._parseBinary(this.response);
            self._compileBuffers(gl, arrays);
            vertComplete = true;
            
            if (modelComplete) {
                self.complete = true;
                if (callback) { callback(self); }
            }
        };
        vertXhr.send(null);

        // Load the json portion of the model
        var jsonXhr = new XMLHttpRequest();
        jsonXhr.open('GET', url + ".wglmodel", true);
        jsonXhr.onload = function() {
            // TODO: Error Catch!
            var model = JSON.parse(this.responseText);
            self._parseModel(model);
            self._compileMaterials(gl, self.meshes);
            modelComplete = true;

            if (vertComplete) {
                self.complete = true;
                if (callback) { callback(self); }
            }
        };
        jsonXhr.send(null);
    };

    Model.prototype._parseBinary = function (buffer) {
        var output = {
            vertexArray: null,
            indexArray: null
        };

        var header = new Uint32Array(buffer, 0, 3);
        if(GetLumpId(header[0]) !== "wglv") {
            throw new Error("Binary file magic number does not match expected value.");
        }
        if(header[1] > 1) {
            throw new Error("Binary file version is not supported.");
        }
        var lumpCount = header[2];

        header = new Uint32Array(buffer, 12, lumpCount * 3);

        var i, lumpId, offset, length;
        for(i = 0; i < lumpCount; ++i) {
            lumpId = GetLumpId(header[i * 3]);
            offset = header[(i * 3) + 1];
            length = header[(i * 3) + 2];

            switch(lumpId) {
            case "vert":
                output.vertexArray = this._parseVert(buffer, offset, length);
                break;

            case "indx":
                output.indexArray = this._parseIndex(buffer, offset, length);
                break;
            }
        }

        return output;
    };

    Model.prototype._parseVert = function(buffer, offset, length) {
        var vertHeader = new Uint32Array(buffer, offset, 2);
        this.vertexFormat = vertHeader[0];
        this.vertexStride = vertHeader[1];

        if(this.vertexFormat & ModelVertexFormat.BoneWeights) {
            this.boneMatrices = new Float32Array(16 * MAX_BONES_PER_MESH);
        }

        return new Uint8Array(buffer, offset + 8, length - 8);
    };

    Model.prototype._parseIndex = function(buffer, offset, length) {
        return new Uint16Array(buffer, offset, length / 2);
    };

    Model.prototype._compileBuffers = function (gl, arrays) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.vertexArray, gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indexArray, gl.STATIC_DRAW);
    };

    Model.prototype._parseModel = function (model) {
        this.meshes = model.meshes;
    };

    Model.prototype._compileMaterials = function (gl, meshes) {
        var i, mesh;
        for (i in meshes) {
            mesh = meshes[i];
            mesh.diffuse = glUtil.loadTexture(gl, mesh.defaultTexture);
        }
    };

    Model.prototype.draw = function (gl, viewMat, projMat) {
	var program = window.program;
	gl.useProgram(program);

	var buffers = glUtil.createCube(gl);
	this.vertBuffer = buffers[0];
	this.indexBuffer = buffers[1];
	// this.cubeTexture = glUtil.loadTexture(gl, "root/texture/crate.png");


	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	gl.uniformMatrix4fv(program.uniform.viewMat, false, viewMat);
	gl.uniformMatrix4fv(program.uniform.projMat, false, projMat);

	// gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.cubeTexture);
	// gl.uniform1i(program.uniform.texture, 0);
	
	gl.enableVertexAttribArray(program.attribute.position);
        gl.vertexAttribPointer(program.attribute.position, 3, gl.FLOAT, false, 0, 0);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    };

    return {
        Model: Model
    };
});