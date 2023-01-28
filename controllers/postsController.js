const Post = require("../models/post");
const Comment = require("../models/comment");
const async = require('async');

// Display list of all posts.
exports.posts_list = (req, res, next) => {
  Post.find({})
    .sort({ timestamp: -1 })
    .populate("author")
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      res.json(list_books);
    });
};

// Display detail page for a specific post.
exports.posts_detail = (req, res, next) => {
  async.parallel(
    {
      post(callback) {
        Post.findById(req.params.postid)
          .populate("author")
          .exec(callback);
      },
      comments(callback) {
        Comment.find({ post: req.params.postid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.post == null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }
      res.json({
        post: results.post,
        comments: results.comments
      });
    }
  );
};

// Handle post create
exports.posts_create = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post create POST");
};

// Handle post delete
exports.posts_delete = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post delete POST");
};

// Handle post update
exports.posts_update = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post update POST");
};