var express = require('express');
var router = express.Router();
s
const comments_controller = require("../controllers/commentsController");

// POST request for creating Comment.
router.post("/comments", comments_controller.comments_create);

module.exports = router;
