const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose")
const Hotel= require("../models/listings.js")
const Review= require("../models/review.js")
const path = require("path")
const methodOverride = require("method-override")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {HotelSchema} = require("../SchemaValidation.js")
const {reviewsSchema} = require("../ReviewValidation.js")
const engine = require("ejs-mate")
const {isLoggedIn , isReviewAuthor} = require("../middlewares.js")
// doing server side validations for listings and reviews
let validateReview = (req , res , next)=>{
    let result = reviewsSchema.validate(req.body.review)
    if(result.error){
        throw new ExpressError(400 , result.error);
    }
     else{
        next()
    }
}
// review creation route
router.post("/"  ,isLoggedIn , validateReview , wrapAsync(async (req , res , next)=>{
    let id = req.params.id;
    let listing = await Hotel.findById(id);
    let newReview = new Review (req.body.reviews)
    newReview.author =req.user._id;
    let reviewAdded = await newReview.save();
    await listing.reviews.push(newReview);
    let lisAndReview = await listing.save();
    console.log(lisAndReview);
    req.flash("success" , "New Review is created")
    res.redirect(`/listings/${listing._id}`)
}))
// delete review route
router.delete("/:reviewId" ,
    isLoggedIn , 
    isReviewAuthor , 
     async(req , res)=>{
    let {id , reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Hotel.findByIdAndUpdate(id , {$pull :{reviews:reviewId}});
    req.flash("success" , "Review is deleted")
    res.redirect(`/listings/${id}`)

})
module.exports = router;