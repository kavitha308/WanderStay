const Hotel = require("../models/listings.js")
module.exports.index = async (req , res)=>{
    let allListings = await Hotel.find({})
    res.render("listings.ejs" , {allListings})
}
module.exports.renderNewForm = (req , res)=>{
    res.render("create.ejs");
}

module.exports.addNewListing = async ( req , res , next)=>{
    let newListing = new Hotel(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save()
    req.flash("success" , "New Listing Is added")
    res.redirect("/listings")
}

module.exports.showListings = async (req , res)=>{
    let {id} = req.params;
    let listing =  await Hotel.findById(id)
    .populate(
        {
        path:"reviews" , 
        populate:{
            path:"author"
        }
        }
    )
    .populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist");
        res.redirect("/listings")
    }
    res.render("show.ejs" ,{listing} )
}

module.exports.renderEditForm = async (req , res)=>{
    let {id} = req.params;
    let listing = await Hotel.findById(id)
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist");
        res.redirect("/listings")
    }
    res.render("edit.ejs" , {listing})
}

module.exports.updateListing = async (req , res)=>{
    let {id} = req.params;
    await Hotel.findByIdAndUpdate(id , {...req.body.listing})
    req.flash("success" , "Listing Is Updated")
    res.redirect("/listings")
}

module.exports.deleteListing = async (req , res)=>{
     if(!req.isAuthenticated()){
        req.flash("error" , "User is not logged in")
        return res.redirect("/login");
    }
    let {id} = req.params;
    await Hotel.findByIdAndDelete(id);
    req.flash("success" , "Listing Is deleted")
    res.redirect("/listings")
}