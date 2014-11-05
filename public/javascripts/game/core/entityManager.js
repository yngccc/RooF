Factory.classes['EntityManager'] = (function() {
    var EntityManager = Class.extend({
	entities : [],

	add : function(entity) {
	    this.entities.push(entity);
	},

	updateEntities : function() {
	    for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].update();
	    }
	}
	    
    });

    return EntityManager;

})();