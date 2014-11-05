Factory.classes['ClientGameEngine'] = (function() {
    var GameEngine = Factory.getClass('GameEngine');

    var ClientGameEngine = GameEngine.extend({
	timeSinceFPSUpdate : 0,

	FPS : 0,
	prevFPS : 0,

	timeSinceGameUpdate : Constants.GAME_LOOP_HZ,
	
	init : function() {
	    this._super();
	},

	run : function(options) {
	    this._super();

	    RenderEngine.render();

// 	    // show FPS
// 	    if (options.showFPS) {
// 		if (this.timeSinceFPSUpdate <= 1) {
// 		    this.timeSinceFPSUpdate += Timer.timeElapsed();
// 		    this.FPS += 1;
// 		} else {
// //		    console.log(this.FPS);
// 		    this.timeSinceFPSUpdate = 0;
// 		    this.prevFPS = this.FPS;
// 		    this.FPS = 0;
// 		}
// 	    }
	},

	update : function() {
	    this._super();
	}
    });

    return ClientGameEngine;

})();