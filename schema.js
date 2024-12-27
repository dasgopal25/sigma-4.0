const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), // Title of the listing
        description: Joi.string().required(), // Description of the listing
        country: Joi.string().required(), // Country where the listing is located
        location: Joi.string().required(), // Location of the listing
        price: Joi.number().required().min(0).max(10000000), // Price should be a positive number and within a reasonable range
        image: Joi.string().uri().allow("", null), // Optional image URL, can be empty or null but must be a valid URL if provided
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // rating of the review
        comment: Joi.string().required(), // comment of the review
    }).required(),
});
