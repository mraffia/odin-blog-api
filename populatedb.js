#! /usr/bin/env node

console.log('This script populates some test users, posts, and comments to the database.');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const User = require('./models/user')
const Post = require('./models/post')
const Comment = require('./models/comment')

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const users = []
const posts = []
const comments = []

function userCreate(name, username, password, is_admin, cb) {
  const user = new User({
    name: name,
    username: username,
    password: password,
    is_admin: is_admin
  });
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  });
}

function postCreate(author, title, content, timestamp, is_published, cb) {
  postdetail = { 
    author: author,
    title: title,
    content: content,
    timestamp: timestamp,
    is_published: is_published,
  }
    
  const post = new Post(postdetail);   

  post.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post)
  });
}


function commentCreate(post, author, content, timestamp, cb) {
  commentdetail = { 
    post: post,
    author: author,
    content: content,
    timestamp: timestamp
  }
    
  const comment = new Comment(commentdetail)

  comment.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Comment: ' + comment);
      cb(err, null)
      return
    }
    console.log('New Comment: ' + comment);
    comments.push(comment)
    cb(null, comment)
  });
}


function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate('Sigma', 'sigma', "males", true, callback);
        },
        function(callback) {
          userCreate('Alpha', 'alpha', "males", true, callback);
        },
        function(callback) {
          userCreate('Beta', 'beta', "males", false, callback);
        },
        ],
        // optional callback
        cb);
}


function createPosts(cb) {
    async.parallel([
        function(callback) {
          postCreate(users[0], 'First Title', 'First content', Date.now(), true, callback);
        },
        function(callback) {
          postCreate(users[0], 'Second Title', 'Second content', Date.now(), false, callback);
        },
        function(callback) {
          postCreate(users[1], 'Third Title', 'Third content', Date.now(), true, callback);
        },
        ],
        // optional callback
        cb);
}


function createComments(cb) {
    async.parallel([
        function(callback) {
          commentCreate(posts[0], users[0], 'First comment content', Date.now(), callback)
        },
        function(callback) {
          commentCreate(posts[0], posts[1], 'Second comment content', Date.now(), callback)
        },
        function(callback) {
          commentCreate(posts[2], posts[2], 'Third comment content', Date.now(), callback)
        },
        ],
        // Optional callback
        cb);
}

async.series([
    createUsers,
    createPosts,
    createComments
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Comments: ' + comments); 
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



