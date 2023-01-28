const User = require("../models/user");

const { body, validationResult } = require("express-validator");

// Handle User create
exports.users_create = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
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
        user: req.body,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Create a User object with escaped and trimmed data.
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({
        user: user,
        user_url: user.url
      });
    });
  },
];