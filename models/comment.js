var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var commentSchema = new Schema({
    op :{type : ObjectId, required : true},
    body : {type : String, required : true},
    replies : [ObjectId]
})

var Comment = mongoose.model('Comment', postSchema);

module.exports = Comment;
