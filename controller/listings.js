const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing=require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted successfully");
    req.flash("success", "listing Deleted !!")
    req.session.save(() => {
        console.log("listngs.js");
        res.redirect("/listings");
    })
}


module.exports.updateListing=async(req,res)=>{
  
    let { id } = req.params;
    // console.log(editListing);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated!!")
    res.redirect(`/listings/${id}`);
}

module.exports.createListing=async(req, res,next) => {
        
    let response = await geocodingClient.forwardGeocode
        ({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
    console.log(response.body.features[0].geometry);
   
   


    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    console.log("user!!!");
    console.log(req.user);
  let savedListing=  await newListing.save();
   console.log(savedListing)
    req.flash("success", "new listing added successfully");
req.session.save(() => {
    
    console.log("listngs.js");
    res.redirect("/listings");
});


    
}


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    
    res.render("listings/edit.ejs",{listing});
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path:"author"
        }
    }).populate("owner");
    if (!listing)
    {
        req.flash("error", "Listing you requested does not exists");
        req.session.save(() => {
            res.redirect("/listings");
        });

    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}