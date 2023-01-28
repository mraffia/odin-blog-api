var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");

// GET request for creating a User. NOTE This must come before routes that display Post (uses id).
router.get("/create", user_controller.user_create_get);

// POST request for creating User.
router.post("/create", user_controller.user_create_post);

module.exports = router;
