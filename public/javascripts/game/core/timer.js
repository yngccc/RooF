Factory.classes['Timer'] = (function() {
    var Timer = Class.extend({
	last : null,

	current : null,

	init : function() {},

	start : function() {
	    this.last = this.current = Date.now();
	},

	tick : function() {
	    this.current = Date.now();
	    var timeElapsed = (this.current - this.last) / 1000;
	    this.last = this.current;
	    return timeElapsed;
	}

    });

    return Timer;
})();