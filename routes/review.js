const express = require("express");
const router = express.Router({mergeParams:true});

const { reviewSchema } = require("../Schema.js");
const Review = require("../models/reviews.js");
const listing = require("../routes/listings.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../Schema.js");
const {validateReviews, isLoggedIn, isReviewAuthor}=require("../middleware.js")


const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const reviewController = require("../controller/review.js");


router.post("/",isLoggedIn, validateReviews, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
