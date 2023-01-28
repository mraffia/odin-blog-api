var express = require('express');
var router = express.Router();

// Require controller modules.
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

/// POST ROUTES ///

// GET catalog home page.
router.get("/", post_controller.index);

// GET request for creating a Post. NOTE This must come before routes that display Post (uses id).
router.get("/post/create", post_controller.post_create_get);

// POST request for creating Post.
router.post("/post/create", post_controller.post_create_post);

// GET request to delete Post.
router.get("/post/:id/delete", post_controller.post_delete_get);

// POST request to delete Post.
router.post("/post/:id/delete", post_controller.post_delete_post);

// GET request to update Post.
router.get("/post/:id/update", post_controller.post_update_get);

// POST request to update Post.
router.post("/post/:id/update", post_controller.post_update_post);

// POST request to publish Post.
router.post("/post/:id/publish", post_controller.post_publish_post);

// POST request to unpublish Post.
router.post("/post/:id/unpublish", post_controller.post_unpublish_post);

// GET request for one Post.
router.get("/post/:id", post_controller.post_detail);

// GET request for list of all Post items.
router.get("/posts", post_controller.post_list);

/// COMMENT ROUTES ///

// POST request for creating Comment.
router.post("/comment/create", comment_controller.comment_create_post);

module.exports = router;
