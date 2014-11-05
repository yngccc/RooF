$(function() {
    $("button#edit").click(function() {
	window.profileView.toggleProfile();
    });

    $("a#friend-list").click(function() {
	window.friendList.toggleList();
    });

    $("a#create-room").click(function() {
	window.socket.emit('create-room', {name : 'chat', type : 'chat'});
    });

    $("div#inputbox").keyup(function(e) {
	if (e.keyCode === 13) 
	    $("a#send-message").click();
    });
    
    $("a#send-message").click(function() {
	var id = window.currentRoom.id;
	var msg = $("input#message").val();
	var user = window.profile.attributes.username;
	window.socket.emit('chat-message', {id: id, msg : msg});
	window.roomViews[id].addMessage(user, msg);
	$("input#message").val("");
    });
    
    $("a#join-room").click(function() {
	$("div#room-portal").show();
    });

    $("div#room-portal a.enter").click(function() {
	var id = $("div#room-portal input.id").val();
	window.socket.emit('join-room', {id : id});
    });

    $("div#room-portal a.close").click(function() {
	$("div#room-portal").hide();
    });

    $("input#friend-search").live('focus', function() {
	var field = $("input#friend-search");
	var newtext = "";
	var oldtext = "";
	setTimeout(function() {
	    newtext = field.val();
	    if (newtext.length < 2) {
		window.friendSearch.hideSearchResult();
	    } else if (newtext != oldtext) {
		oldtext = newtext;
		$.ajax({
		    url : '/search/username/' + newtext,
		    dataType : 'json'
		}).done(function(results) {
		    window.friendSearch.showSearchResult(results);
		});
	    }
	    setTimeout(arguments.callee, 150);
	}, 200);
    });
    
    $("button#request").live('click', function() {
	window.friendRequest.toggle();
    });

});