(function() {
    var FactoryClass = Class.extend({
	classes : {},

	getClass : function(name) {
	    return this.classes[name];
	},

	getInstance : function() {
	    var className = arguments[0];

	    var classToCreate = this.classes[className];
	    
	    switch (arguments.length) {
	    case 1:
		return new classToCreate();
	    case 2:
		return new classToCreate(arguments[1]);
	    case 3:
		return new classToCreate(arguments[1], arguments[2]);
	    case 4:
		return new classToCreate(arguments[1], arguments[2], arguments[3]);
	    case 5:
		return new classToCreate(arguments[1], arguments[2], arguments[3], arguments[4]);
	    case 6:
		return new classToCreate(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
	    default : 
		console.log('unable to create > 5 arguments object');
		return null;
	    }
	}
    });
    
    Factory = new FactoryClass;
    
})();