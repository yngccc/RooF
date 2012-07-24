(function($) {
    window.Album = Backbone.Model.extend({
	isFirstTrack : function() {
	    return index === 0;
	},

	isLastTrack : function(index) {
	    return index >= this.get('track').length - 1;
	},

	trackUrlAtIndex : function(index) {
	    if (this.get('tracks').length >= index) {
		return this.get('tracks')[index].url;
	    }
	    return null;
	}
    });

    window.Albums = Backbone.Collection.extend({
	model : Album,
	url : '/albums'
    });

    window.Playlist = Albums.extend({
	isFirstAlbum : function(index) {
	    return index === 0;
	},

	isLastAlbum : function(index) {
	    return index === (this.models.length -1);
	}
    });
	
    window.Player = Backbone.Model.extend({
	defaults : {
	    'currentAlbumIndex' : 0,
	    'currentTrackIndex' : 0,
	    'state' : 'stop'
	},
	
	initialize : function() {
	    this.playlist = new Playlist();
	},

	play : function() {
	    this.set({'state' : 'play'});
	},

	pause : function() {
	    this.set({'state' : 'pause'});
	},
        isPlaying: function() {
            return (this.get('state') == 'play');
        },
        
        isStopped: function() {
            return (!this.isPlaying());
        },

        currentAlbum: function() {
            return this.playlist.at(this.get('currentAlbumIndex'));
        },

        currentTrackUrl: function() {
            var album = this.currentAlbum();
            return album.trackUrlAtIndex(this.get('currentTrackIndex'));
        },

        nextTrack: function() {
            var currentTrackIndex = this.get('currentTrackIndex'),
            currentAlbumIndex = this.get('currentAlbumIndex');
            if (this.currentAlbum().isLastTrack(currentTrackIndex)) {
                if (this.playlist.isLastAlbum(currentAlbumIndex)) {
                    this.set({'currentAlbumIndex': 0});
                    this.set({'currentTrackIndex': 0});
                } else {
                    this.set({'currentAlbumIndex': currentAlbumIndex + 1});
                    this.set({'currentTrackIndex': 0});
                }
            } else {
                this.set({'currentTrackIndex': currentTrackIndex + 1});
            }
            this.logCurrentAlbumAndTrack();
        },

        prevTrack: function() {
            var currentTrackIndex = this.get('currentTrackIndex'),
            currentAlbumIndex = this.get('currentAlbumIndex'),
            lastModelIndex = 0;
            if (this.currentAlbum().isFirstTrack(currentTrackIndex)) {
                if (this.playlist.isFirstAlbum(currentAlbumIndex)) {
                    lastModelIndex = this.playlist.models.length - 1;
                    this.set({'currentAlbumIndex': lastModelIndex});
                } else {
                    this.set({'currentAlbumIndex': currentAlbumIndex - 1});
                }
                // In either case, go to last track on album
                var lastTrackIndex = 
                    this.currentAlbum().get('tracks').length - 1;
                this.set({'currentTrackIndex': lastTrackIndex});                
            } else {
                this.set({'currentTrackIndex': currentTrackIndex - 1});
            }
            this.logCurrentAlbumAndTrack();
        },
        
        logCurrentAlbumAndTrack: function() {
            console.log("Player " + 
                        this.get('currentAlbumIndex') + ':' + 
                        this.get('currentTrackIndex'), this);
        }
    });

    window.library = new Albums();
    window.player = new Player();

    window.AlbumView = Backbone.View.extend({
	tagNme: 'li',
	className: 'album',

	initialize: function() {
	    _.bindAll(this, 'render');
	    this.template = _.template($('#album-template').html());
	    this.model.bind('change', this.render);
	},

	render: function() {
	    var renderedContent = this.template(this.model.toJSON());
	    $(this.el).html(renderedContent);
	    return this;
	}
    });

    window.LibraryAlbumView = AlbumView.extend({
	events: {
	    "click .queue.add" : "select"
	},

	select: function() {
	    this.collection.trigger('select', this.model);
	    console.log("Triggered select ", this.model);
	}
    });

    window.LibraryView = Backbone.View.extend({
	tagName: 'section',
	className: 'library',

	initialize : function() {
	    _.bindAll(this, 'render');
	    this.template = _.template($('#libray-template').html());
	    this.collection.bind('reset', this.render);
	},

	render: function() {
	    var $albums
	    , collection = this.collection;

	    $(this.el).html(this.template({}));
	    $albums = this.$('.albums');

	    collection.each(function(album) {
		var view = new LibraryAlbumView({
		    model: album,
		    collection: collection
		});
		$albums.append(view.render().el);
	    });
	    return this;
	}
    });

    window.BackboneTunes = Backbone.Router.extend({
	routes: {
	    '' : 'home'
	},

	initialize : function() {
	    this.libraryView = new LibraryView({
		collection : window.library
	    });
	},

	home : function() {
	    $('#container').empty().append(this.libraryView.render().el);
	}
    });

    $(function() {
	window.app = new BackboneTunes();
	Backbone.history.start();
    });
    
})(jQuery);