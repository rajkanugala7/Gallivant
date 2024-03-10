const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");


const listingSchema=new mongoose.Schema({
    title : {
        type:String,
        required:true
    },
    description :{
        type:String,
        
    },
    image :{
        type:String,
        default:"https://media.istockphoto.com/id/1017425824/photo/beach-and-rustic-thatched-roof-palapa-montego-bay-jamaica-caribbean-sea.webp?b=1&s=170667a&w=0&k=20&c=evouph8R_7zxKj24XqE2G_aYZWS66r5KP1cUaRvWEwU="
        ,set:(v)=>
            v==="" ?  "https://media.istockphoto.com/id/1017425824/photo/beach-and-rustic-thatched-roof-palapa-montego-bay-jamaica-caribbean-sea.webp?b=1&s=170667a&w=0&k=20&c=evouph8R_7zxKj24XqE2G_aYZWS66r5KP1cUaRvWEwU=" : v,
        
        
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log("DEleted reviews");
    }
})
 
const Listing=mongoose.model("Listing",listingSchema);
module.exports = Listing;
