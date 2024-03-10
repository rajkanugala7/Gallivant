const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");



router.route("/signup")
    .get( userController.renderSignUpForm)
    .post(wrapAsync(userController.createAccount))




router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), wrapAsync(userController.login))

   




router.get("/logout",userController.logOut)






module.exports = router;