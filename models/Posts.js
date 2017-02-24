var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    link: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    usersWhoUpvoted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    usersWhoDownvoted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }] // The ref option is what tells Mongoose which model to use during population
});

// Assign custom method to model
// Upvote the post
postSchema.methods.upvote = function(user, callback){
    // If this user hasn't upvoted yet:
	if (this.usersWhoUpvoted.indexOf(user._id) == -1) {
		this.usersWhoUpvoted.push(user._id);
		this.upvotes++;

		// If this user has downvoted, revert the downvote:
		if (this.usersWhoDownvoted.indexOf(user._id) != -1) {
			this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
			this.downvotes--;
		}

		this.save(callback);
	} else {
		// TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote - or does it?
		this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
		this.upvotes--;

		this.save(callback);
	}
};

// Downvote the post
postSchema.methods.downvote = function(user, callback){
	if (this.usersWhoDownvoted.indexOf(user._id) == -1) {
		this.usersWhoDownvoted.push(user._id);
		this.downvotes++;

		// If this user has upvoted, revert the upvote:
		if (this.usersWhoUpvoted.indexOf(user._id) != -1) {
			this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
			this.upvotes--;
		}

		this.save(callback);
	} else {
		// TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote
		this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
		this.downvotes--;

		this.save(callback);
	}
};

mongoose.model('Post', postSchema);
