const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloud.js");
const upload = multer({ storage })

const listingController = require("../controllers/listing.js");

//Index router //Create router
router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


//New router
router.get("/new", isLoggedIn, listingController.renderNewFrom);

//Show router //Edit router //Delete router
router.route("/:id")
.get(wrapAsync(listingController.listingShow))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;