var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendRequestSchema = new Schema({
    sender : {type : String, require : true},
    receiver : {type : String, require : true},
    message : String
});

var FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;