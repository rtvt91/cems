'use strict'

var mongoose = require('mongoose'),
    Q = require('q'),
    Schema = mongoose.Schema;
    
mongoose.Promise = Q.Promise;

var PostSchema = new Schema({
	id: Schema.ObjectId,
	date: { type: Date, required: true },
	active : { type: Boolean, required: true, default: true},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	categoryId: {type: Schema.Types.ObjectId, ref:'Category', required: true},
	url: {type: String, required: true},
	title: {type: String, required: true},
	content: {type: Array, required: true}
});

PostSchema.statics.create = function(postInfo){
	var newPost = new Post({
			date: new Date(),
			active: false,
            userId: postInfo.userId,
            categoryId: postInfo.categoryId,
            url: postInfo.url,
            title: postInfo.title,
            content: postInfo.content
		});
	return newPost;
};

PostSchema.statics.findAll = function(){
    var promise = this.find({})
						.sort({'date': 'descending'})
						.populate({path:'categoryId', select:'name active'})
						.populate({path:'userId', select:'firstname lastname email active role'})
    return promise;
};

PostSchema.statics.findBy = function(query){
	var promise = this.find(query)
						.sort({'date': 'descending'})
						.populate({path:'categoryId', select:'name active'})
						.populate({path:'userId', select:'firstname lastname email active role'});
	return promise;
};

PostSchema.statics.modify = function(queryId, updatedData){
	var promise = this.findByIdAndUpdate(queryId, updatedData, {new: true});
    return promise;
};

PostSchema.statics.delete = function(id){
	var promise = this.findByIdAndRemove(id).select();
    return promise;
};

PostSchema.methods.record = function(){
	return this.save();
};

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;