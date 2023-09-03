var express = require('express');
var router = express.Router();
var client = require('../db');
const commonmark = require('commonmark');

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

/* SINGLE BLOG POST */
router.get('/:username/:postid', function(req, res, next) {
    // Sanitize parameters

    // Get parameters
    var username = req.params.username;
    var postid = req.params.postid;
    // Check parameters
    if(!username) {
        res.status(404);
        return res.send("Missing username parameter!")
    }
    if(isNaN(postid)) {
        res.status(400);
        return res.send("Bad post id!");
    }
    // If postid string is a number, parse it
    else {
        postid = parseInt(postid);
    }
    if(postid < 0) {
        res.status(400);
        return res.send("Bad post id!");
    }
    // Get database
    var blogposts = client.db('BlogServer');
    blogposts.collection('Posts').findOne({ username: username, postid: postid })
    .then((post) => {
        if(post == null) {
            res.status(404);
            return res.send("No post found!");
        }
        else {
            res.status(200);
            // Format post attributes; commonmark
            post.title = writer.render(reader.parse(post.title));
            post.body = writer.render(reader.parse(post.body));
            post.created = new Date(post.created * 1000);
            post.modified = new Date(post.modified * 1000);
            return res.render('post', { page_title: 'Displaying Post', post: post });
        }
    });
});

/* ALL POSTS */
router.get('/:username', function(req, res, next) {
    // Sanitize parameters

    // Get parameters
    var username = req.params.username;
    var start = req.query.start;
    // Check username parameter
    if(!username) {
        res.status(404);
        return res.send("Missing username parameter!")
    }
    // Handle optional query
    var postid = 0;
    if(start) {
        // Check postid parameter
        if(isNaN(start)) {
            res.status(400);
            return res.send("Bad post id!");
        }
        else {
            postid = parseInt(start);
        }
        if(postid < 0) {
            res.status(400);
            return res.send("Bad post id!");
        }
    }
    // Get database
    var blogposts = client.db('BlogServer');
    const user_input = [ { username: username }, { postid: { $gte: postid } } ];
    blogposts.collection('Posts').find({ $and: user_input })
    .limit(5)
    .sort({ postid: 1 })
    .toArray()
    .then((posts) => {
        if(posts == null || posts.length == 0) {
            res.status(404);
            return res.send("No posts found!");
        }
        else {
            res.status(200);
            // Format each post returned; commonmark
            posts.forEach(function(post) {
                post.title = writer.render(reader.parse(post.title));
                post.body = writer.render(reader.parse(post.body));
                post.created = new Date(post.created * 1000);
                post.modified = new Date(post.modified * 1000);
            });
            // Mark postid of last post in array for next page button (to get next 5 posts)
            var last_postid = posts[posts.length - 1].postid + 1;
            return res.render('all_posts', { page_title: 'Displaying Post(s)', posts: posts, username: username, postid: last_postid });
        }
    });
});

module.exports = router;