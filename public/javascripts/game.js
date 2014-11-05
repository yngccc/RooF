$(function() {
    function GameClass() {
    };

    GameClass.prototype.init = function() {
	this.loadScripts(this.run);
    };

    GameClass.prototype.run = function() {
	if (!GameAssets.ready) {
	    setTimeout(arguments.callee, 10);
	} else {
	    RenderEngine = Factory.getInstance('RenderEngine');
	    PhysicsEngine = Factory.getInstance('PhysicsEngine');
	    InputEngine = Factory.getInstance('InputEngine');
	    Timer = Factory.getInstance('Timer');
	    MapEngine = Factory.getInstance('ClientMapEngine');
	    EntityManager = Factory.getInstance('EntityManager');
	    Player = Factory.getInstance('ClientPlayer');
	    GameEngine = Factory.getInstance('ClientGameEngine');
	    
	    options = {
		debug : true,
		showFPS : true
	    }
	    
	    Timer.start();
	    // here we go 
	    (function go() {
		GameEngine.run(options);
		requestAnimFrame(go);
	    })();
	}
    },

    GameClass.prototype.loadScripts = function(next) {
	// order of scripts matter!!
	var scripts = [
	    'javascripts/vendor/box2D.js',
	    'javascripts/game/core/util.js',
	    'javascripts/game/core/asset.js',
	    'javascripts/game/core/constant.js',
	    'javascripts/game/core/factory.js',
	    'javascripts/game/core/timer.js',
	    'javascripts/game/core/entity.js',	
	    'javascripts/game/core/entityManager.js',
	    'javascripts/game/core/player.js',
	    'javascripts/game/core/physics.js',
	    'javascripts/game/core/map.js',
	    'javascripts/game/core/game.js',

	    'javascripts/game/client/renderer.js',
	    'javascripts/game/client/sprite.js',
	    'javascripts/game/client/player.js',
	    'javascripts/game/client/map.js',
	    'javascripts/game/client/input.js',
	    'javascripts/game/client/game.js'
	];
	
	yepnope({
	    load : scripts,
	    complete : next
	});
    };
    

    window.Game = new GameClass;

});
