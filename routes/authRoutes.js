const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/refresh").get(authController.refresh);


module.exports = router