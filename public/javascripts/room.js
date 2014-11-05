$(function() {
    window.Room = Backbone.Model.extend({
	initialize : function(id) {
	    this.id = id;
	    this.url = '/room/' + id;
	}
    });

    window.RoomView = Backbone.View.extend({
	el : $("div#main"),

	initialize : function(model, type) {
	    this.model = model;
	    type = type || "" ;
	    this.template = _.template($("#room-template").html());
	},

	// DON'T PUT GAME INIT HERE
	render : function() {
	    $(this.el).html(this.template(this.model));
	    window.Game.init();
	    return this;
	},
	
	addMessage : function(user, msg) {
	    $("div#chatbox", this.el).append("<p>" + user + " : " + msg + "</p>");
	},

	addMember : function(user) {
	    $.ajax({
		url : '/profile/'+user,
		dataType : 'json',
	    }).done(function(data) {
		var img = "<img class=" + user + " src=" + data.picture + 
		    " height='7%' width='13%'" + " />";
		$("div#member-pics").append(img);

	    });
	},
	
	removeMember : function(user) {
	    $("div#member-pics img." + user).remove();
	}
    });


});