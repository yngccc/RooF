Factory.classes['Entity'] = (function() {
    var ID = 0;

    var Entity = Class.extend({
	id : 0,
	
	pos : {
	    x : 0,
	    y : 0
	},

	lastPos : {
	    x : 0,
	    y : 0
	},

	hsize : {
	    x : 0,
	    y : 0
	},

	setPos: null,

	sprites : null,

	currentAnimation : null,
	currentAnimationIndex : 0,
	currentAnimationLength : 0,
	framesPerAnimation : 0,
	framesCounter : 0,
	
	init : function() {
	    this.id = ++ID;
	    this.sprites = Factory.getInstance('Sprites');

	    EntityManager.add(this);
	},

	update : function() {
	    if (this.setPos) {
		this.pos.x = this.setPos.x;
		this.pos.y = this.setPos.y;
		this.setPos = null;
	    }
	    
	    this.lastPos.x = this.pos.x;
	    this.lastPos.y = this.pos.y;
	    
	    var pos = PhysicsEngine.getPosition(this.physBody);
	    this.pos.x = pos.x;
	    this.pos.y = pos.y;
	},


	changeAnimation : function(animation) {
	    this.currentAnimation = animation;
	    this.currentAnimationIndex = 0;
	    this.currentAnimationLength = this.sprites.animations[this.currentAnimation].length;
	},

	sendPhysicsUpdates : function(clientControlledPhysics) {},

	on_phys : function(msg) {},
	
	getPhysicsSyncAdjustment : function() {},

	autoAdjustVelocity : function() {},

	kill : function() {},

	centerAt : function() {},

	distanceTo : function(other) {},

    });
    
    return Entity;

})();
