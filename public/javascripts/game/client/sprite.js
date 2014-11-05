Factory.classes['Sprites'] = (function() {
    var Sprites = Class.extend({
	animations : {},

	loadAnimations : function(animations) {
	    var frames = GameAssets.spriteSheetData.frames;
	    var reflect;

	    for (var animIdx = 0; animIdx < animations.length; animIdx++) {
		var animation = animations[animIdx];
		// if animation ends with '_', load the mirror reflection of that image
		if (/_$/.test(animation)) {
		    reflect = true;
		    animation = animation.substr(0, animation.length-1);
		} else {
		    reflect = false;
		}

		var i = 0;
		while (true) {
		    var anim = animation + '_' + i + '.png';
		    if (!frames[anim]) break;
		    var data = frames[anim].frame;
		    var sprite = {
			x : data.x,
			y : data.y,
			w : data.w,
			h : data.h,
			r : reflect
		    };
		    this.pushAnimation(animation, sprite);
		    i += 1;
		}
	    }
	},

	pushAnimation : function(name, sprite) {
	    this.animations[name] ? 
		(this.animations[name].push(sprite)) : (this.animations[name] = [sprite]);
	},

	drawAnimation : function(name, index, viewportX, viewportY) {
	    var sprite = this.animations[name][index];
	    var img = GameAssets.spriteSheet;
	    
	    var context = RenderEngine.context;

	    if (sprite.r) {
		// DOESNT WORK!!!!
		context.save();
		
		context.drawImage(img, sprite.x, sprite.y, 
				  sprite.w, sprite.h, 
				  viewportX, viewportY,
				  sprite.w, sprite.h);
		context.restore();
	    } else {
		context.save();
		context.drawImage(img, sprite.x, sprite.y, 
				  sprite.w, sprite.h, 
				  viewportX, viewportY,
				  sprite.w, sprite.h);
		context.restore();
	    }
	}
    });

    return Sprites;

})();