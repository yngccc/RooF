$(function() {
    window.socket = io.connect(window.location.hostname);
    
    window.socket.on('friend-request', function(data) {
	window.friendRequest.add(data.request);
    });

    window.socket.on('friend-accept', function(data) {
	// turn this into a friend warning
	console.log(data.receiver + " has accepted your friend request");
    });

    window.socket.on('room-avaliable', function(data) {
	window.rooms[data.id] = new window.Room(data.id);
	window.rooms[data.id].fetch({success : function() {
	    window.roomViews[data.id] = new window.RoomView(window.rooms[data.id]);
	    window.roomViews[data.id].render();
	    window.currentRoom = window.rooms[data.id];
	}});
    });

    window.socket.on('room-not-avaliable', function(reason) {
	alert(reason);
    });
    
    // NOT WORKING
    window.socket.on('chat-history', function(data) {
	_.each(data, function(d) {
	    window.roomViews[window.currentRoom.id].addMessage('placeholder', d);
	});
    });

    window.socket.on('people-join', function(data) {
	window.roomViews[data.id].addMessage(data.user, "has joined the room");
	window.roomViews[data.id].addMember(data.user);
    });

    window.socket.on('people-leave', function(data) {
	window.roomViews[data.id].addMessage(data.user, "has left the room");
	window.roomViews[data.id].removeMember(data.user);
    });

    window.socket.on('invitation', function(data) {});
    
    window.socket.on('chat-message', function(data) {
	window.roomViews[data.id].addMessage(data.user, data.msg);
    });    

});