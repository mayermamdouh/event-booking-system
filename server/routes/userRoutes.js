const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.route("/register").post(userController.register);
router.route("/login").post(userController.login);

module.exports = router;