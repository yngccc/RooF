Factory.classes['Player'] = (function() {
    var Entity = Factory.getClass('Entity');

    var Player = Entity.extend({
	life : 100,
	maxLife : 100,
	mana : 100,
	maxMana : 100,

	level : 1,
	exp : 0,

	speed : 1.3,
	items : [],

	init : function() {
	    this._super();
	},

	spawn : function() {
	    // wtf
	    this.pos.x = MapEngine.pixelSize.x/4;
	    this.pos.y = MapEngine.pixelSize.y/4;
	    
	    var entityDef = {
		id : "player",
		x : this.pos.x,
		y : this.pos.y,
		halfHeight : 26, // size of player, tweak this number
		halfWidth : 26, 
		damping : 0,
		angle : 0,
		categories : ['player'],
		collideWith : ['all'],
		userData : {
		    "id" : "player",
		    "ent" : this
		}
	    };
	    this.physBody = PhysicsEngine.addBody(entityDef);
	},

	update : function() {
	    this._super();
	    var position = PhysicsEngine.getPosition(this.physBody);
	},

	walkDown : function() {
	    if (this.currentAnimation !== 'walk_down') 
		this.changeAnimation('walk_down');
	    PhysicsEngine.setVelocity(this.physBody, 0, -this.speed);
	    RenderEngine.moveViewport(0, 1);
	},

	walkUp : function() {
	    if (this.currentAnimation !== 'walk_up') 
		this.changeAnimation('walk_up');
	    PhysicsEngine.setVelocity(this.physBody, 0, this.speed);
	    RenderEngine.moveViewport(0, -1);
	},

	walkLeft : function() {
	    if (this.currentAnimation !== 'walk_left') 
		this.changeAnimation('walk_left');
	    PhysicsEngine.setVelocity(this.physBody, -this.speed, 0);
	    RenderEngine.moveViewport(-1, 0);
	},
	
	walkRight : function() {
	    if (this.currentAnimation !== 'walk_right') 
		this.changeAnimation('walk_right');
	    PhysicsEngine.setVelocity(this.physBody, this.speed, 0);
	    RenderEngine.moveViewport(1, 0);
	}
    });

    return Player;

})();
