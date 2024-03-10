const User = require("../models/user.js");

module.exports.renderSignUpForm=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.createAccount=async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if ((err) => {
                return next(err);
            })
                req.flash("success", "welcome to WanderLust");
            res.redirect("/listings");
      });


       
    }
    catch (e) {
        req.flash("error", e.message);
        req.session.save(() => {
            res.redirect("/signup");
        })
    }
}

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    
    req.flash("success", "Welcome back to WanderLust ! You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 

}

module.exports.logOut= (req, res,next) => {
    req.logout((err) => {
        if (err)
            next(err);
   
        req.flash("success", "you are logged  out!");
        res.redirect("/listings");
    });
}