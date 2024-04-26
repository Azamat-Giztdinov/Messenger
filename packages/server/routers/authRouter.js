const express = require("express");
const {validateForm} = require("../controllers/validateForm");
const router = express.Router();
const {handeleLogin, attemptLogin, attemptRegister} = require("../controllers/authController");
const {rateLimiter} = require("../controllers/rateLimiter")

router.route("/login")
  .get(handeleLogin)
  .post(validateForm, rateLimiter(60, 10) , attemptLogin);

router.post("/signup",validateForm, rateLimiter(30, 4), attemptRegister);
module.exports = router;