/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function(){};
    
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
	var _super = this.prototype;
	
	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	var prototype = new this();
	initializing = false;
	
	// Copy the properties over onto the new prototype
	for (var name in prop) {
	    // Check if we're overwriting an existing function
	    prototype[name] = typeof prop[name] == "function" && 
		typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		(function(name, fn){
		    return function() {
			var tmp = this._super;
			
			// Add a new ._super() method that is the same method
			// but on the super-class
			this._super = _super[name];
			
			// The method only need to be bound temporarily, so we
			// remove it when we're done executing
			var ret = fn.apply(this, arguments);        
			this._super = tmp;
			
			return ret;
		    };
		})(name, prop[name]) :
            prop[name];
	}
	
	// The dummy class constructor
	function Class() {
	    // All construction is actually done in the init method
	    if ( !initializing && this.init )
		this.init.apply(this, arguments);
	}
	
	// Populate our constructed prototype object
	Class.prototype = prototype;
	
	// Enforce the constructor to be what we expect
	Class.prototype.constructor = Class;

	// And make this class extendable
	Class.extend = arguments.callee;
	
	return Class;
    };
})();

// requestAnimationFrame for smart animating
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

merge = function(original, extended)
{
    for (var key in extended)
    {
        var ext = extended[key];
        if (
	    typeof (ext) != 'object' ||
		ext instanceof Class
	)
        {
            original[key] = ext;
        }
        else
        {
            if (!original[key] || typeof (original[key]) != 'object')
            {
                original[key] = {};
            }
            merge(original[key], ext);
        }
    }
    return original;
};
    
copy = function (object) 
{
    if (
	!object || typeof (object) != 'object' ||
	    object instanceof Class
    ) {
        return object;
    }
    else if (object instanceof Array) {
        var c = [];
        for (var i = 0, l = object.length; i < l; i++) {
            c[i] = copy(object[i]);
        }
        return c;
    }
    else {
        var c = {};
        for (var i in object) {
            c[i] = copy(object[i]);
        }
        return c;
    }
};

ksort = function (obj) {
    if (!obj || typeof (obj) != 'object') {
        return [];
    }

    var keys = [], values = [];
    for (var i in obj) {
        keys.push(i);
    }

    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        values.push(obj[keys[i]]);
    }

    return values;
};


