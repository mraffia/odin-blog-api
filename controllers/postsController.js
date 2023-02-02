const async = require('async');
const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const Comment = require("../models/comment");

// Display list of all posts.
exports.posts_list = (req, res, next) => {
  Post.find({})
    .sort({ timestamp: -1 })
    .populate("author")
    .exec(function (err, posts) {
      if (err) {
        return next(err);
      }
      res.json({
        message: "Get all posts successful",
        posts
      });
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
        Comment.find({ post: req.params.postid })
          .sort({ timestamp: -1 })
          .exec(callback);
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
        message: "Get a post successful",
        post: results.post,
        comments: results.comments
      });
    }
  );
};

// Handle post create
exports.posts_create = [
  // Validate and sanitize fields.
  body("post_author", "Author must not be empty.")
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
  body("is_published").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return data with sanitized values/errors messages.
      res.json({
        message: "Invalid form data",
        post: req.body,
        errors: errors.array()
      });
      return;
    }

    // Data from form is valid.
    // Create a Post object with escaped and trimmed data.
    const post = new Post({
      author: req.body.post_author,
      title: req.body.post_title,
      content: req.body.post_content,
      is_published: req.body.is_published
    });

    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({
        message: "Create a post successful",
        post: post,
        post_url: post.url
      });
    });
  },
];

// Handle post delete
exports.posts_delete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.postid, (err, thepost) => {
    if (err) {
      return next(err);
    }
    res.json({ 
      message: "Delete a post successful",
      post: thepost,
    });
  });
};

// Handle post update
exports.posts_update = [
  // Validate and sanitize fields.
  body("post_author", "Author must not be empty.")
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
  body("is_published").escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return data with sanitized values/errors messages.
      res.json({
        message: "Invalid form data",
        post: req.body,
        errors: errors.array()
      });
      return;
    }

    // Data from form is valid.
    // Create a Post object with escaped and trimmed data and old id.
    const post = new Post({
      author: req.body.post_author,
      title: req.body.post_title,
      content: req.body.post_content,
      is_published: req.body.is_published,
      _id: req.params.postid
    });

    Post.findByIdAndUpdate(req.params.postid, post, {}, (err, thepost) => {
      if (err) {
        return next(err);
      }
      res.json({
        message: "Update a post successful",
        post: thepost,
        post_url: thepost.url
      });
    });
  },
];