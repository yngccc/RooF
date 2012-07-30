var mongoose = require('mongoose')
, crypto = require('crypto')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;


var userSchema = new Schema({
    username : {type : String, required : true, unique : true, index : true},
    email : {type : String, required : true, unique : true},
    salt : {type : String},
    password : {type : String, required : true},
    name : {type : String, default : ""},
    bio : {type : String, default : ""},
    friends : [ObjectId],
    friendrequests : [String],
    messages : [ObjectId]
    
});

userSchema.methods.encodePassword = function(password, callback) {
    var salt = crypto.randomBytes(32);
    this.salt = salt.toString('hex');
    crypto.pbkdf2(password, this.salt, 1000, 32, function(err, pass) {
	if (err) return callback(err);
	pass = Buffer(pass, 'binary').toString('hex');
	callback(null, pass);
    });
};


var User = mongoose.model('User', userSchema);

module.exports = User;




