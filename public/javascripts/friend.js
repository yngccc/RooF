$(function() {    
    window.Friends = Backbone.Model.extend({
	url : 'friend/profiles'
    });


    window.FriendInfo = Backbone.View.extend({
	el : $("div#friendinfo"),
	template : _.template($("#friendinfo-template").html()),

	initialize : function() {
	    
	    _.bindAll(this);
	},

	render : function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	},

	show : function(model) {
	    this.model = model;
	    this.render();
	}
    });
    

    window.FriendList = Backbone.View.extend({
	el: $("div#friendlist"),
	template : _.template($("#friendlist-template").html()),

	friendList : [],

	events : {
	    'click h4.friend-info' : 'info',
	    'click i.remove-friend' : 'remove',
	    'click i.msg-friend' : 'msg',
	    'click i.chat-friend' : 'chat'
	},

	initialize : function() {
	    _.bindAll(this);
	    var that = this;
	    $.get('friend/profiles', function(data) {
		that.friendList = data;
		window.setTimeout(function() {
		    that.updateOnlineStatus();
		    window.setTimeout(arguments.callee, 20000);
		}, 0);
	    });
	},
	
	render : function() {
	    $(this.el).html(this.template({friends : this.friendList}));
	},

	updateOnlineStatus : function() {
	    var friends = _.pluck(this.friendList, 'username');
	    var that = this;
	    $.get('friend/online', {friends : friends}, function(data) {
		var i, j;
		var temp;
		for (i = 0; i < data.length; i++) {
		    temp = data[i];
		    for(j = 0; j < data.length; j++) {
			if (that.friendList[j].username === temp.username) {
			    that.friendList[j].online = temp.online;
			    break;
			}
		    }
		}
		that.render();
	    });
	},

	toggleList : function() {
	    $(this.el).toggle();
	},
	
	add : function(friend) {
	    var that = this;
	    $.get('friend/profile/' + friend, function(data) {
		that.friendList.push(data);
		that.render();
	    });
	},

	info : function(event) {
	    var username = event.srcElement.innerText;
	    var friend = _.find(this.friendsInfo, function(friend) {
		return friend.username === username; 
	    });
	    
	    window.FriendInfo.show(friend);
	    $("div#friendinfo").show();
	},
	
	remove : function(event) {
	    var parent = event.target.parentNode;
	    var friend = $('h4', parent).text();
	},
	msg : function() {},
	chat : function() {}
    });    

    window.FriendSearch = Backbone.View.extend({
	el : $("div#friendsearch"),
	
	template : _.template($("#friendsearch-template").html()),

	events : {
	    "click i.friend-request" : "request",
	    "click i.send-message" : "message"
	},

	render : function(results) {
	    $(this.el).html(this.template({results : results}));
	},

	showSearchResult : function(results) {
	    this.render(results);
	    $(this.el).show();
	},

	hideSearchResult : function() {
	    $(this.el).html('').hide();	   
	},

	request : function(event) {
	    var username = $(event.target).parent().children('.username').text().trim();
	    $.post('friend/request', {receiver : username}, function(data) {
		if (data.error)
	    	    $('#alert-content').html(data.error);
		else
		    $('#alert-content').html(data.success);
	    	$('.alert').show();
		if (data.online) 
		    window.socket.emit('friend-request', {request : data.request});
	    });
	},
	
	message : function(event) {
	    var username = $(event.target).parent().children('.username').text().trim();
	},
    });
    
    window.FriendRequest = Backbone.View.extend({
	el : $("div#friendrequest"),
	template : _.template($("#friendrequest-template").html()),

	requests : [],
	
	events : {
	    'click .accept-request' : 'accept',
	    'click .decline-request' : 'decline'
	},

	initialize : function() {
	    _.bindAll(this);
	    var that = this;
	    $.get('friend/requests', function(data) {
		that.requests = data;
		if (data.length > 0)
		    that.insertButton();
		that.render();
	    });
	},

	render : function() {
	    $(this.el).html(this.template({requests : this.requests}));
	},

	add : function(request) {
	    this.requests.push(request);
	    this.render();
	    if (this.requests.length === 1) 
		this.insertButton();
	    else 
		this.modifyButton();
	},

	remove : function(id) {
	    var i;
	    for (i = 0; i < this.requests.length; i++ ) {
		if (this.requests[i]._id === id) {
		    this.requests.remove(i);
		    break;
		}
	    }
	    this.render();
	    if (this.requests.length <= 0) {
		this.removeButton();
		this.toggle();
	    }
	    else {
		this.modifyButton();
	    }
	},	    
	
	insertButton : function() {
	    var button =  "<button class='btn btn-warning btn-large pull-right' id='request'>"
                button += "<i class='icon-github icon-large'></i>"
                button += "<strong> &nbsp&nbsp" + this.requests.length + " Friend Requests </strong>"
                button += "</button>"
	    $(button).insertAfter('button#edit');
	},

	removeButton : function() {
	    $("button#request").remove();
	},

	modifyButton : function(numRequest) {
	    $("button#request strong").html("&nbsp&nbsp" + this.requests.length + " Friend Requests");
	},

	toggle : function() {
	    $(this.el).toggle();
	},

	accept : function(event) {
	    var request = $(event.target).parent();
	    var username = request.children('.username').text().trim();
	    var id = request.children('.id').text().trim();
	    var that = this;
	    $.post('friend/accept', {id : id}, function(data) {
		if (data.error) 
	    	    $('#alert-content').html(data.error);
		else
		    $('#alert-content').html(data.success);
	    	$('.alert').show();
		if (data.online) 
		    window.socket.emit('friend-accept', data.request);
		
		that.remove(id);
		window.friendList.add(username);
	    });
	},

	decline : function(event) {
	    var request = $(event.target).parent();
	    var username = request.children('.username').text().trim();
	    var id = request.children('.id').text().trim();
	    var that = this;
	    $.post('friend/decline', {id : id}, function(data) {
		if (data.error) 
	    	    $('#alert-content').html(data.error);
		else
		    $('#alert-content').html(data.success);
	    	$('.alert').show();
		if (data.online) 
		    window.socket.emit('friend-accept', {user : username});
		
		that.remove(id);
	    });
	}

    });
});