Factory.classes['ClientPlayer'] = (function() {
    var Player = Factory.getClass('Player');
    
    var ClientPlayer = Player.extend({
	// player is always rendered at center
	renderPos : {
	    x : 0,
	    y : 0
	},

	init : function() {
	    this._super();

	    this.framesPerAnimation = 10;
	    this.loadAnimations();
	    this.changeAnimation('stand_down');

	    this.renderPos.x = RenderEngine.viewport.w/2;
	    this.renderPos.y = RenderEngine.viewport.h/2
	},

	loadAnimations : function() {
	    var animations = ['stand_down', 'stand_left', 'stand_right_', 'stand_up',
			      'walk_down', 'walk_left', 'walk_right_', 'walk_up'];
	    
	    this.sprites.loadAnimations(animations);
	},

	draw : function() {
	    this.sprites.drawAnimation(this.currentAnimation,
				       this.currentAnimationIndex,
				       this.renderPos.x, this.renderPos.y);

	    if (++this.framesCounter !== this.framesPerAnimation) return;

	    (this.currentAnimationIndex === (this.currentAnimationLength -1)) ?
		(this.currentAnimationIndex = 0) :
		(this.currentAnimationIndex += 1);

	    this.framesCounter = 0;
	}
    });

    return ClientPlayer;

})();
