$(function() {
    $("a#logout").click(function() {
	window.location.replace("http://localhost:3000/logout");
    });
});

// User Profile
$(function($) {
    var Profile = Backbone.Model.extend({
	url : '/profile'
    });
    
    window.Profile = new Profile;

    var ProfileView = Backbone.View.extend({
	className : 'row',
	profile : $("div#profile"),
	template : _.template($("#profile-template").html()),

	initialize : function(model) {
	    this.model = model;
	    this.model.fetch();
	    this.profile.hide();
	},
	
	render : function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	},

	toggleProfile : function() {
	    if (this.profile.is(":visible")) {
		this.profile.slideUp();
		return;
	    }
	    this.profile.hide();
	    this.profile.append(this.render().el);
	    this.profile.slideDown();
	},
	
	// WORK IN PROGRESS
	events : {
	    "click div.username" : "setUsername",
	    "click div.email" : "setEmail",
	    "click div.bio" : "setBio",
	    "click div.password" : "setPassword"
	},
	
	setUsername : function() {},
	setEmail : function() {},
	setBio : function() {},
	setPassword : function() {}
    });

    window.ProfileView = new ProfileView(window.Profile);
    
    $("a#edit").click(function() {
	window.ProfileView.toggleProfile();
    });

}(jQuery));

// friendlist
(function($) {
    window.Friend = Backbone.Model.extend({
	
    });


    window.Friends = Backbone.Collection.extend({
	model : window.Friend
    });

    window.FriendList = Backbone.View.extend({
	tagName : 'ul',
	
	friendlist : $("div#friendlist"),
	template : _.template($("#friendlist-template").html()),
	
	initialize : function(collection) {
	    this.collection = collection;
	    this.friendlist.hide();
	},
	
	render : function(x) {
	    $(this.el).html(this.template(collection));
	    return this;
	},

	toggleFriendlist : function() {
	    if (this.friendlist.is(":visible")) {
		this.friendlist.slideUp();
		return;
	    }
	    this.friendlist.hide();
	    this.friendlist.append(this.render().el);
	    this.friendlist.slideDown();
	}
    });
	    
}(jQuery));	



 