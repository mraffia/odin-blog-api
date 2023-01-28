const Post = require("../models/post");

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
  res.send(`NOT IMPLEMENTED: Post detail: ${req.params.id}`);
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