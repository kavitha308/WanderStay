const express = require("express");
const router = express.Router({mergeParams:true});
const User= require("../models/user.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middlewares.js")
router.get("/signup" , (req , res)=>{
    res.render("../users/signup.ejs")
})
router.post("/signup" , async (req , res)=>{
 try{
    let {username , email , password} = req.body;
    const NewUser = new User({
    email , username
})
let userNew = await User.register(NewUser , password);
console.log(userNew);
req.login(userNew , (err)=>{
    if(err){
        return next(err);
    }
    req.flash("success" , "welcome to wanderlust");
    res.redirect("/listings");
})
 }
catch(e){
    req.flash("error" , e.message);
    res.redirect("/signup");
}
})
router.get("/login" , (req , res)=>{
    res.render("../users/login.ejs");
})
router.post("/login"  ,saveRedirectUrl , 
    passport.authenticate("local" , {failureRedirect :"/login" , failureFlash :true}) , 
    async (req , res)=>{
        req.flash("success" , "Welcome back to wanderLust");
        let redirectUrl =  res.locals.redirectUrl ||  "/listings" ;
    res.redirect(redirectUrl);
})
router.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success" , "logged out");
        res.redirect("/listings");
    })
})
module.exports = router;