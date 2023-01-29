const express = require('express');
const router = express.Router();

const auth_controller = require("../controllers/authController");

router.post("/signup", auth_controller.auth_signup);

router.post("/login", auth_controller.auth_login);

router.get("/logout", auth_controller.auth_logout);

module.exports = router;

