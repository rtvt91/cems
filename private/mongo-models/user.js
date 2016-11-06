'use strict'

var mongoose = require('mongoose'),
    Q = require('q'),
    bcrypt = require('bcryptjs'),
    fs = require('fs'),
    path = require('path'),
    Schema = mongoose.Schema,
    CONST = require('../config/constant');
    
mongoose.Promise = Q.Promise;

var UserSchema = new Schema({
	id: Schema.ObjectId,
	date: { type: Date, required: true },
	active : { type: Boolean, default: true},
	email: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	role: {type: String, required: true}
});

UserSchema.statics.create = function(userInfo){

	var ftPath = path.join(__dirname, '../config/first-time.json'),
        firstTime = JSON.parse(fs.readFileSync(ftPath, 'utf8')),
		hash = bcrypt.hashSync(userInfo.password, bcrypt.genSaltSync(10)),
		newUser = new User({
			email: userInfo.email,
			password: hash,
			firstname: userInfo.firstname,
			lastname: userInfo.lastname,
			date: new Date(),
			role: (firstTime.start)? CONST.USER.ROLE.ADMIN : CONST.USER.ROLE.WRITER,
			active: firstTime.start
		});

	if(firstTime.start){
		firstTime.start = false;
		fs.writeFileSync(ftPath, JSON.stringify(firstTime, null, 2));
	}

	return newUser;
};

UserSchema.statics.findAll = function(){
    var promise = this.find().select('active date email firstname lastname role');
    return promise;
};

UserSchema.statics.findBy = function(query, retrievePass){
	var selection = (retrievePass)? 'active date email password firstname lastname role' : 'active date email firstname lastname role';
	var promise = this.find(query).select(selection);
	return promise;
};

UserSchema.statics.update = function(queryId, updatedData){
	var promise = this.findByIdAndUpdate(queryId, updatedData, {new: true});
    return promise;
};

UserSchema.statics.delete = function(id){
	var promise = this.findByIdAndRemove(id).select('active date email firstname lastname role');
    return promise;
};

UserSchema.methods.record = function(){
	return this.save();
};

var User = mongoose.model('User', UserSchema);

module.exports = User;