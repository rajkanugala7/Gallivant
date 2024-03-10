const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema } = require("../Schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn, isOwner, validatingListing } = require("../middleware.js");
const multer = require('multer')
const storage=require("../cloudConfig.js")
const upload = multer({storage:storage})

const listingController=require("../controller/listings.js")

router.route("/")
.get( wrapAsync(listingController.index))
.post(validatingListing, isLoggedIn,wrapAsync(listingController.createListing))
    // .post( upload.single('listing[image]'),(req, res) => {
    //     res.send(req.file);
// })

//index route
 
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
    .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
    .get(isLoggedIn,wrapAsync(listingController.showListing))






// app.post("/listings",async(req,res)=>{
//     const newListing= new Listing(...req.body.listing);
//     console.log(newListing);
//     await newListing.save();
//     res.redirect("/listings");
// });





router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));







module.exports = router;

