'use strict'

var mongoose = require('mongoose'),
    Q = require('q'),
	path = require('path'),
	fs = require('fs'),
    Schema = mongoose.Schema;
    
mongoose.Promise = Q.Promise;

var CategorySchema = new Schema({
	id: Schema.ObjectId,
	date: { type: Date, required: true },
	active : { type: Boolean, default: true},
    name: {type: String, unique: true, required: true},
	defaultCat: {type:Boolean, required: true}
});

CategorySchema.statics.create = function(categoryInfo){
	var ftPath = path.join(__dirname, '../config/first-time.json'),
		firstTime = JSON.parse(fs.readFileSync(ftPath, 'utf8')),
		newCategory = new Category({
			date: new Date(),
			active: true,
            name: categoryInfo.name,
			defaultCat: firstTime.start
		});
	return newCategory;
};

CategorySchema.statics.findAll = function(){
    var promise = this.find().select('id date active name defaultCat');
    return promise;
};

CategorySchema.statics.findBy = function(query){
	var promise = this.find(query).select('id date active name defaultCat');
	return promise;
};

CategorySchema.statics.update = function(queryId, updatedData){
	var promise = this.findByIdAndUpdate(queryId, updatedData, {new: true});
    return promise;
};

CategorySchema.statics.delete = function(queryId){
	var promise = this.findByIdAndRemove(queryId).select('id date active name defaultCat');
    return promise;
};

CategorySchema.methods.record = function(){
	return this.save();
};

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;