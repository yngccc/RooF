$(function() {
    // profile
    window.profile = new window.Profile;
    window.profileView = new window.ProfileView(window.Profile);
    window.profile.fetch();
    
    // friend
    window.friendList = new window.FriendList;

    window.friendInfo = new window.FriendInfo;
    window.friendSearch = new window.FriendSearch;
    window.friendRequest = new window.FriendRequest;

    // rooms
    window.rooms = {};
    window.roomViews = {};
    window.currentRoom = null;
});