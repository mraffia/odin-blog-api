var express = require('express');
var router = express.Router();

const users_controller = require("../controllers/usersController");

// POST request for creating User.
router.post("/", users_controller.users_create);

module.exports = router;
