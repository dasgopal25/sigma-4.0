const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserControllre = require("../controllers/user.js")

let passAuthenticate = passport.authenticate("local", { failureRedirect: "/login", failureFlash: true });


router.route("/signup")
.get(UserControllre.renderSignupFrom )
.post( wrapAsync(UserControllre.SignupUser));


router.route("/login")
.get(UserControllre.renderLoginFrom)
.post(saveRedirectUrl, passAuthenticate,UserControllre.userLogin);


router.get("/logout",UserControllre.logoutUser);

module.exports = router;