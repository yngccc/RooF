var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;


var messageSchema = new Schema({
    sender : {type : ObjectId, require : true},
    receiver : {type : ObjectId, require : true}
    body : String,
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;