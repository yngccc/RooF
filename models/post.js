var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    op : {type : ObjectId, required : true},
    title : {type : String, required : true},
    body : {type : String, required : true},
    comments : [ObjectId]
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
