(function() {
    var GameAssetsClass = Class.extend({
	ready : false,
	
	numAssets : 4,
	
	map : null,

	mapData : null,
	
	spriteSheet : null,

	spriteSheetData : null,

	init : function() {
	    this.loadMap();
	    this.loadMapData();
	    this.loadSpriteSheet();
	    this.loadSpriteSheetData();
	},

	loadMap : function() {
	    var self = this;
	    this.map = new Image();
	    this.map.src = "game_assets/img/map.png";
	    this.map.onload = function() {
		if (!(--self.numAssets)) self.ready = true;
	    };
	},

	loadMapData : function() {
	    var self = this;
	    $.getJSON('game_assets/json/map.json', function(data) {
		self.mapData = data;
		if (!(--self.numAssets)) self.ready = true;
	    });
	},

	loadSpriteSheet : function() {
	    var self = this;
	    this.spriteSheet = new Image();
	    this.spriteSheet.src = "game_assets/img/zelda.png";
	    this.spriteSheet.onload = function() {
		if (!(--self.numAssets)) self.ready = true;
	    };
	},

	loadSpriteSheetData : function() {
	    var self = this;
	    $.getJSON('game_assets/json/zelda.json', function(data) {
		self.spriteSheetData = data;
		if (!(--self.numAssets)) self.ready = true;
	    });
	}
    });
    
    // global??
    GameAssets = new GameAssetsClass;

})();