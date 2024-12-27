const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.postReviews = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", " Add review!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReviews = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};