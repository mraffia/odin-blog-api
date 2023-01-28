const Comment = require("../models/comment");

const { body, validationResult } = require("express-validator");

// Handle Comment create
exports.comments_create = [
  // Validate and sanitize fields.
  body("post", "Post must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("comment_content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return data with sanitized values/errors messages.
      res.json({
        comment: req.body,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Create a Comment object with escaped and trimmed data.
    const comment = new Comment({
      post: req.body.post,
      author: req.body.author,
      content: req.body.comment_content,
    });

    comment.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({
        comment: comment,
        comment_url: comment.url
      });
    });
  },
];
