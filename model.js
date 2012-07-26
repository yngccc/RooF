var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;


var userSchema = new Schema({
    username : {type : String, required : true, unique : true, lowercase : true},
    email : {type : String,  unique : true, match : /^\S+@\S+\.\S+$/},
    password : {type : String, required : true},
});

var User = mongoose.model('User', userSchema);

exports.User = User;


var postSchema = new Schema({
    op : {type : ObjectId, required : true},
    title : {type : String, required : true},
    body : {type : String, required : true},
    comments : [ObjectId]
});

var Post = mongoose.model('Post', postSchema);

exports.Post = Post;

var commentSchema = new Schema({
    op :{type : ObjectId, required : true},
    body : {type : String, required : true},
    replies : [ObjectId]
})

var Comment = mongoose.model('Comment', postSchema);

exports.Comment = Comment;

