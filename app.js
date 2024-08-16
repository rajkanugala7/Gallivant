
if (process.env.NODE_ENV != "production") {

    require('dotenv').config()
}
console.log(process.env.CLOUD_API_SECRET);
const db_url=process.env.ATLASDB_URL;

const express = require("express");
const app=express();
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const { reviewSchema } = require("./Schema.js");
const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listings.js");


const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl: mongodb+srv://rajkanugala5:8ZdNx1zcUzOQVqCw@cluster0.x122rpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24*3600

})
store.on("error", () => {
    console.log("error in Mongodb Session store", err);
})




const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};



const mongoose=require("mongoose");

//app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));



app.use(express.static(path.join(__dirname, "/public")));
//  app.use((req, res, next) => {
//      res.locals.success = req.flash("success");
//      console.log(res.success);
//      next();
//  })
// app.use(session(sessionOptions));
// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     console.log(res.locals.success);
//     next();
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
})
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine('ejs', ejsMate);

//  app.use(express.static(path.join(__dirname, "/public")));
//  app.use((req, res, next) => {
//      res.locals.success = req.flash("success");
//      console.log(res.success);
//      next();
//  })



app.use("/listings", listingRouter);
app.use("/", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)


app.get("/getcookies",(req, res)=> {
    res.cookie("Hello", "Deltaits");
    res.send("Hello Deltaits");
})
main().then(()=>{
    console.log("COnnected to DB successfull;")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(db_url);
}
 










app.get("/random", (req, res) => {
    res.send(`<h1>I am random</h1>`);
})

app.all("*",(req,res,next)=>{


    next(new ExpressError(404,"page not found"));
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message}); 
});

app.listen(8080,()=>{
    console.log("Listening to the port 8080");
});
