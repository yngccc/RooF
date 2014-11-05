Factory.classes['GameEngine'] = (function() {
    var GameEngine = Class.extend({
	entities : [],

	fps : 0,
	currentTick : 0,
	lastFpsSec : 0,

	init : function() {
	    MapEngine.load(GameAssets.mapData);
	    Player.spawn();
	},

	run : function() {
	    var interval = Timer.tick();
	    
	    InputEngine.flushCommands();
	    PhysicsEngine.update(interval);
	    EntityManager.updateEntities();
	},

	update : function() {
	    this.currentTick++;
	    
	    for (var i = 0; i < this.entities.length; i++) {
		var ent = this.entities[i];
		if (!ent._killed) {
		    ent.update();
		}
	    }

	    for (var i = 0; i < this._deferredKill.length; i++) {
		this.entities.erase(this._deferred[i]);
	    }
	    this._deferredKill = [];

	    for (var p in this.Players) {
		this.Players[p].applyInputs();
	    }
	},

	updatePhysics: function() {
	    PhysicsEngine.update();
	    
	    for (var p in this.Players) {
		var player = this.Players[p];
		var pos = player.physBody.GetPosition();
		player.pos.x = pos.x;
		player.pos.y = pos.y;
	    }
	},

	onCollisionTouch :function(bodyA, bodyB, impulse) {},

	getTime : function() { return this.currentTick * 0.05; },

	getEntityByName : function (name) {
	    return this.nameEntities[name];
	},

	getEntityById : function (id) {
	    for (var i = 0; i < this.entities.length; i++) {
		var e = this.entities[i];
		if (e.id === id) {
		    return e;
		}
	    }
	    return null;
	},

	getEntitiesByLocation : function (pos) {
	    var entities = [];
	    for (var i = 0; i < this.entities.length; i++) {
		var e = this.entities[i];
		if (e.pos.x <= pos.x && e.pos.y <= pos.y && (e.pos.x + e.size.x) > pos.x && (e.pos.y + e.size.y) > pos.y) {
		    entities.push(e);
		}
	    }
	    return entities;
	},

	getEntitiesWithinCircle : function(center, radius) {
	    var a = [];
	    for (var i = 0; i < this.entities.length; i++) {
		var ent = this.entities[i];
		var dist = Math.sqrt((ent.pos.x - center.x)*(ent.pos.x - center.x) + (ent.pos.y - center.y)*(ent.pos.y - center.y));
		if (dist <= radius) {
		    a.push(ent);
		}
	    }
	    return a;
	},

	getEntitiesByType: function (typeName) {
	    var entityClass = Factory.nameClassMap[typeName];
	    var a = [];
	    for (var i = 0; i < this.entities.length; i++) {
		var ent = this.entities[i];
		if (ent instanceof entityClass && !ent._killed) {
		    a.push(ent);
		}
	    }
	    return a;
	},

	nextSpawnId : function() {
	    return this.spawnCounter++;
	},

	onSpawned : function() {},

	spawnEntity : function(typename, x, y, setting) {
	    var entityClass = Factory.nameClassMap[typename];
	    var es = setting || {};
	    es.type = typename;

	    var e = new entityClass(x, y, es);
	    
	    GameEngine.entities.push(e);
	    if (e.name) {
		GameEngine.nameEntities[e.name] = e;
	    }
	    GameEngine.onSpawned(e);
	    if (e.type === "Player") {
		this.Players[e.name] = e;
	    }
	    return e;
	},

	respawnEntity : function(respkt) {
	},

	removeEntity : function(ent) {
	    if (!ent) return;
	    if (ent.name) {
		delete this.nameEntities[ent.name];
		delete this.Players[ent.name];
	    }

	    ent._killed = true;
	    this._deferredKill.push(ent);
	},


    });

    return GameEngine;

})();
