const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const { reviewSchema } = require("./Schema.js");
const Review = require("./models/reviews.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be Logged In");
        return res.redirect("/login");
        
    }
    next();
}


module.exports.saveRedirectUrl = (req, res,next) => {
    if (req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
  
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings"); // Redirect to an error page or handle it as per your application flow
        }

        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }

        next();
   
};




module.exports.validatingListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}


module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
  
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);

   
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();

};
