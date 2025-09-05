const express = require("express");
const router = express.Router();
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
const listings = require("../routes/listing.js");
const {isLoggedIn , isOwner} = require("../middlewares.js");
const listingController = require("../controllers/listings.js")
// router.engine("ejs" , engine)
// doing server side validations for listings and reviews
let validateData = (req , res , next)=>{
    let result = HotelSchema.validate(req.body)
    console.log(result.error)
    if(result.error){
        throw new ExpressError(400 , result.error);
    }
    else{
        next()
    }
}
let validateReview = (req , res , next)=>{
    let result = reviewsSchema.validate(req.body.review)
    if(result.error){
        throw new ExpressError(400 , result.error);
    }
     else{
        next()
    }
}

// index route ........................................
router.get("/" , wrapAsync(listingController.index))

// create new listing route
router.get("/new" ,isLoggedIn , listingController.renderNewForm)

// adding new list into database
router.post("/"  ,validateData , wrapAsync(listingController.addNewListing))

// show route
router.get("/:id" , wrapAsync(listingController.showListings))

// edit route
router.get("/:id/edit" ,isLoggedIn ,isOwner ,   wrapAsync(listingController.renderEditForm))

// updata route
router.put("/:id" ,isLoggedIn  ,isOwner,   wrapAsync(listingController.updateListing))

// Delete route
router.delete("/:id" ,isLoggedIn ,isOwner,  wrapAsync(listingController.deleteListing))

module.exports = router;