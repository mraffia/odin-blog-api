const async = require("async");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

exports.auth_signup = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must be at least 5 characters long.")
    .isLength({ min: 5 }),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Return data with sanitized values/errors messages.
      res.json({
        message: "Invalid form data",
        user: req.body,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      // Check if User with same username already exists.
      User.findOne({ username: req.body.username }).exec((err, found_user) => {
        if (err) {
          return next(err);
        }
        if (found_user) {
          res.json({
            message: "Username already exist",
            user: req.body,
            errors: errors.array()
          });
          return;
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
              return next(err);
            } else {
              const user = new User({
                name: req.body.name,
                username: req.body.username,
                password: hashedPassword
              });
              
              user.save(err => {
                if (err) { 
                  return next(err);
                }
                res.json({
                  message: "Sign up successful",
                  user,
                  user_url: user.url
                });
              });
            }
          });
        }
      });
    }
  },
];

exports.auth_login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.json(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, 'jwt_secret');
      return res.json({ user, token });
    });
  })(req, res);
}

exports.auth_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Log out successful" });
  });
}