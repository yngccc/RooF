var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Scheme.ObjectId;


var userSchema = new Schema({
    username : {type : String, required : true, unique : true, lowercase : true},
    email : {type : String,  unique : true, match : /^\S+@\S+\.\S+$/},
    password : {type : String, required : true},
});

var User = mongoose.model('User', userSchema);

exports.User = User


var 