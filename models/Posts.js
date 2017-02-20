var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] // The ref option is what tells Mongoose which model to use during population
});

// Assign custom method to model
// Upvote the post
postSchema.methods.upvote = function(cb){
  this.upvotes += 1;
  this.save(cb);
};

// Downvote the post
postSchema.methods.downvote = function(cb){
  this.downvotes += 1;
  this.save(cb);
};

mongoose.model('Post', postSchema);
