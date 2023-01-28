const Post = require("../models/post");
const Comment = require("../models/comment");

const async = require('async');
const { body, validationResult } = require("express-validator");

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
exports.posts_create = [
  // Validate and sanitize fields.
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("post_title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("post_content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("post_timestamp", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("is_published").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return data with sanitized values/errors messages.
      res.json({
        post: req.body,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Create a Post object with escaped and trimmed data.
    const post = new Post({
      author: req.body.author,
      title: req.body.post_title,
      content: req.body.post_content,
      timestamp: req.body.post_timestamp,
      is_published: req.body.is_published,
    });

    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({
        post: post,
        post_url: post.url
      });
    });
  },
];

// Handle post delete
exports.posts_delete = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post delete POST");
};

// Handle post update
exports.posts_update = (req, res, next) => {
  res.send("NOT IMPLEMENTED: Post update POST");
};