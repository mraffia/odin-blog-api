var express = require('express');
var router = express.Router();

const posts_controller = require("../controllers/postsController");

// GET request for list of all Post items.
router.get("/", posts_controller.posts_list);

// GET request for one Post.
router.get("/:postid", posts_controller.posts_detail);

// POST request for creating Post.
router.post("/", posts_controller.posts_create);

// DELETE request to delete Post.
router.delete("/:postid", posts_controller.posts_delete);

// PUT request to update Post.
router.put("/:postid", posts_controller.posts_update);

module.exports = router;
