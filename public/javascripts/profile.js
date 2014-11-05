$(function() {
    window.Profile = Backbone.Model.extend({
	url : '/profile'
    });
        
    window.ProfileView = Backbone.View.extend({
	el : $("div#profile"),
	template : _.template($("#profile-template").html()),
	
	events : {
	    'click button#save' : 'save'
	},

	initialize : function(model) {
	    _.bindAll(this);
	    this.model = model;
	    this.model.bind('change', this.render);
	},

	render : function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	},

	toggleProfile : function() {
	    $(this.el).slideToggle();
	},
	
	save : function() {
	    this.model.save();
	}

    });
    
			  
});




 