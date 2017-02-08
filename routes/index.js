var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// code from here

var mongoose = require('mongoose');
var Post = mongoose.model('Post');          // Load post model
var Comment = mongoose.model('Comment');    // Load comment model

// Get all posts
router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if(err) { return next(err); }

        res.json(posts);
    });
});

// Create new post
router.post('/posts', function (req, res, next) {
    var post = new Post(req.body);

    post.save(function(err, post) {
      if (err) { return next(err); }

      console.log(post);

      res.json(post);
    });
});

//
router.param('post', function(req, res, next, id){
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

//
router.get('/posts/:post', function (req, res) {
    res.json(req.post);
});


// upvoting posts
router.put('/posts/:post/upvote', function (req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

// create 'comments' route for a particular 'post'
router.post('/posts/:post/comments', function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function (err, comment) {
        if (err) { return next(err); }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) { return next(err); }

            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
    Post.upvote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

module.exports = router;
