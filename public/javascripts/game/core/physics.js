Factory.classes['PhysicsEngine'] = (function() {
    var Vec2 = Box2D.Common.Math.b2Vec2;
    var BodyDef =  Box2D.Dynamics.b2BodyDef;
    var Body =  Box2D.Dynamics.b2Body;
    var FixtureDef =  Box2D.Dynamics.b2FixtureDef;
    var Fixture =  Box2D.Dynamics.b2Fixture;
    var World =  Box2D.Dynamics.b2World;
    var MassData = Box2D.Collision.Shapes.b2MassData;
    var PolygonShape =  Box2D.Collision.Shapes.b2PolygonShape;
    var CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var DebugDraw =  Box2D.Dynamics.b2DebugDraw;
    var RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var ContactListener = Box2D.Dynamics.b2ContactListener;

    var COLLISION_GROUP = {
	'player': 0x0001,
	'projectile': 0x0001 << 1,
	'pickupobject': 0x0001 << 2,

	'mapobject': 0x0001 << 3,
	'projectileignore': 0x0001 << 4,

	'all': 0xFFFF
    };
    
    var PhysicsEngine = Class.extend({
	world : null,
	
	init : function() {
	    this.world = new World(new Vec2(0, 0), false);

	    Box2D.Common.b2Settings.b2_maxTranslation = 99999;
	    Box2D.Common.b2Settings.b2_maxTranslationSquared = Box2D.Common.b2Settings.b2_maxTranslation * Box2D.Common.b2Settings.b2_maxTranslation;
	},

	update : function(interval) {
	    this.world.Step(interval, 10, 10);
	    this.world.ClearForces();
	},

	addBody : function(entityDef) {
	    // setup body
	    var bodyDef = new BodyDef;
 
	    if (entityDef.type === 'static') {
		bodyDef.type = Body.b2_staticBody;
	    } else {
		bodyDef.type = Body.b2_dynamicBody;
	    }
	    
	    bodyDef.position.x = entityDef.x;
	    bodyDef.position.y = entityDef.y;

	    if (entityDef.userData) bodyDef.userData = entityDef.userData;
	    if (entityDef.angle) bodyDef.angle = entityDef.angle;
	    if (entityDef.damping) bodyDef.damping = entityDef.damping;

	    var body = this.world.CreateBody(bodyDef);

	    // setup fixture
	    var fixtureDef = new FixtureDef;
	    fixtureDef.density = 1.0;
	    fixtureDef.friction = 0;

	    if (entityDef.useBouncyFixture) 
		fixtureDef.restitution = 1.0;
	    else 
		fixtureDef.restitution = 0;

	    // setup fixture collision
	    if (entityDef.categories && entityDef.categories.length) {
		fixtureDef.filter.categories = 0x0000;
		for (var i = 0; i < entityDef.categories.length; i++) {
		    fixtureDef.filter.categoryBits |= COLLISION_GROUP[entityDef.categories[i]];
		} 
	    } else {
		fixtureDef.filter.categoryBits = COLLISION_GROUP['player'];
	    }
	    
	    if (entityDef.collidesWith && entityDef.collidesWith.length) {
		fixtureDef.filter.maskBits = 0x0000;
		for (var i = 0; i < entityDef.collidesWith.length; i++) {
		    fixtureDef.filter.maskBits |= COLLISION_GROUP[entityDef.collidesWith[i]];
		}
	    } else {
		fixtureDef.filter.maskBits = 0xFFFF;
	    }
	    
	    // setup fixture shape
	    if (entityDef.raidus) {
		fixtureDef.shape = new CircleShape(entityDef.radius);
	    } else if (entityDef.polyPoints) {
		var points = entityDef.polyPoints;
		var vecs = [];
		for (var i = 0; i < points.length; i++) {
		    var vec = new Vec2(points[i].x, points[i].y);
		    vecs[i] = vec;
		}
		fixtureDef.shape = new PolygonShape;
		fixtureDef.shape.SetAsArray(vecs, vecs.length);
	    } else {
		fixtureDef.shape = new PolygonShape;
		fixtureDef.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
	    }
	    
	    body.CreateFixture(fixtureDef);

	    return body;
	},

	getBody : function(body) {
	    return {
		x : body.GetPosition().x,
		y : body.GetPosition().y,
		a : body.GetAngle(),
	    };
	},

	removeBody : function(body) {
	    this.world.DestroyBody(obj);
	},

	addContactListener: function (callbacks) {
	    var listener = new Box2D.Dynamics.b2ContactListener;
	    if (callbacks.BeginContact) listener.BeginContact = function (contact) {
		callbacks.BeginContact(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody());
	    }
	    if (callbacks.EndContact) listener.EndContact = function (contact) {
		callbacks.EndContact(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody());
	    }
	    if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
		callbacks.PostSolve(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody(), impulse.normalImpulses[0]);
	    }
	    this.world.SetContactListener(listener);
	},

	applyImpulse : function(body, degrees, power) {
	    body.ApplyImpulse(new Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), body.GetWorldCenter());
	},
	
	clearImpulse : function(body) {
	    body.m_linearVelocity.setZero();
	    body.m_angularVelocity = 0.0;
	},
	
	setVelocity: function (body, x, y) {
	    body.SetLinearVelocity(new Vec2(x, y));
	},

	getVelocity: function (body) {
	    return body.GetLinearVelocity();
	},

	getPosition: function (body) {
	    return body.GetPosition();
	},

	setPosition: function (body, x, y) {
	    var pos = new Vec2(x, y);
	    body.SetPosition(pos);
	}

    });

    return PhysicsEngine;

})();

