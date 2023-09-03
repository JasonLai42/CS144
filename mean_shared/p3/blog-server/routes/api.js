var express = require('express');
var router = express.Router();
var client = require('../db');

router.get('/posts', function(req, res, next) {
  // Sanitize parameters
  
  // Get parameters; username parameter already checked in auth.js
  var username = req.query.username;
  var postid = req.query.postid;
  // Handle different routes
  if(!postid) {
    // Get database
    var blog_server = client.db('BlogServer');
    blog_server.collection('Posts').find({ username: username })
    .sort({ postid: 1 })
    .toArray()
    .then((posts) => {
        res.status(200);
        // Set Content-Type of header
        res.header("Content-Type", "application/json");
        if(posts == null || posts.length == 0) {
          // Even if no posts or user exists, return an empty array
          return res.json([]);
        }
        else {
          // Return entire array of JSON posts
          return res.json(posts);
        }
    });
  }
  else {
    // Check postid parameters
    if(isNaN(postid)) {
      res.status(400);
      return res.send("Bad post id!");
    }
    else {
      postid = parseInt(postid);
    }
    if(postid < 0) {
      res.status(400);
      return res.send("Bad post id!");
    }
    // Get database
    var blog_server = client.db('BlogServer');
    blog_server.collection('Posts').findOne({ username: username, postid: postid })
    .then((post) => {
        if(post == null) {
          res.status(404);
          return res.send("No post found!");
        }
        else {
          // Return the post JSON
          res.status(200);
          return res.json(post);
        }
    });
  }
});

router.delete('/posts', function(req, res, next) {
  // Sanitize parameters
  
  // Get parameters
  var username = req.query.username;
  var postid = req.query.postid;
  // Check postid parameters
  if(isNaN(postid)) {
    res.status(400);
    return res.send("Bad post id!");
  }
  else {
    postid = parseInt(postid);
  }
  if(postid < 0) {
    res.status(400);
    return res.send("Bad post id!");
  }
  // Get database
  var blog_server = client.db('BlogServer');
  blog_server.collection('Posts').deleteOne({ username: username, postid: postid }, (err, results) => { 
    if(results.deletedCount != 1) {
      res.status(404);
      return res.send("No post found!");
    }
    else {
      res.status(204);
      return res.send("Post successfully deleted!");
    }
  });
});

router.post('/posts', function(req, res, next) {
  // Sanitize parameters

  // Get parameters
  var username = req.body.username;
  var postid = req.body.postid;
  var title = req.body.title;
  var body = req.body.body;
  // Check parameters
  if(!username || postid == null || title == null || body == null) {
    res.status(400);
    return res.send("Missing request body JSON fields!")
  }
  if(isNaN(postid)) {
    res.status(400);
    return res.send("Bad post id!");
  }
  else {
    postid = parseInt(postid);
  }
  // Handle different routes
  if(postid == 0) {
    // Get database
    var blog_server = client.db('BlogServer');

    /* GET THE MAXID */
    blog_server.collection('Users').findOne({ username: username })
    .then((user) => {
      if(user == null) {
        res.status(404);
        return res.send("No user found!");
      }
      else {
        // Get additional post details
        var max_id = user.maxid + 1;
        var created = Date.now();
        var modified = Date.now();

        // Check maxid is at least 1
        if(max_id < 1) {
          res.status(404);
          return res.send("Bad maxid found!");
        }

        /* INSERT THE NEW POST */
        blog_server.collection('Posts').insertOne(
          {  
            postid: max_id,
            username: username,
            created: created,
            modified: modified,
            title: title,
            body: body
          }, 
          (err, results) => {
            if(results.insertedCount != 1) {
              res.status(404);
              return res.send("Failed to insert post!");
            }
            else {
              /* UPDATE THE USER MAXID */
              blog_server.collection('Users').updateOne({ username: username }, { $set: { maxid: max_id } }, (err, results) => { 
                if(results.matchedCount == 0) {
                  res.status(404);
                  return res.send("User not found!");
                }
                else if(results.modifiedCount != 1) {
                  res.status(404);
                  return res.send("Failed to update user!");
                }
                else {
                  res.status(201);
                  return res.json(
                    { 
                      postid: max_id, 
                      created: created, 
                      modified: modified 
                    }
                  );
                }
              });
            }
          }
        );
      }
    });
  }
  else if(postid > 0) {
    // Get database
    var blog_server = client.db('BlogServer');

    // Get modified time for updated post
    var modified = Date.now();
    
    /* UPDATE THE POST */
    blog_server.collection('Posts').updateOne({ username: username, postid: postid }, 
      { $set: { title: title, body: body, modified: modified } }, 
      (err, results) => { 
        if(results.matchedCount == 0) {
          res.status(404);
          return res.send("Post not found!");
        }
        else if(results.modifiedCount != 1) {
          res.status(404);
          return res.send("Failed to update post!");
        }
        else {
          res.status(200);
          return res.json(
            { 
              modified: modified 
            }
          );
        }
      }
    );
  }
  else {
    // If postid is negative
    res.status(400);
    return res.send("Bad post id!");
  }
});

module.exports = router;