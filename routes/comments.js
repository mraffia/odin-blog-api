const express = require('express');
const router = express.Router();

const comments_controller = require("../controllers/commentsController");

// POST request for creating Comment.
router.post("/", comments_controller.comments_create);

module.exports = router;
