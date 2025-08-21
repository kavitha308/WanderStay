const express = require("express");
const app = express();
const mongoose = require("mongoose")
const Hotel= require("./models/listings.js")
const Review= require("./models/review.js")
const path = require("path")
const methodOverride = require("method-override")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {HotelSchema} = require("./SchemaValidation.js")
const {reviewsSchema} = require("./ReviewValidation.js")
const engine = require("ejs-mate")
app.engine("ejs" , engine)
//////////////////////////////////////////////////////////////////////////////////////////
const initdata = require("./init/initData.js")
// const mongoose  = require("mongoose")
// const Listing = require("../models/listings.js")
main()
.then(()=>{
    console.log("connection successful... .")
})
.catch((e)=>{
    console.log(e)
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}
const initDB = wrapAsync(async()=>{
    await Hotel.deleteMany({});
   let res =  await Hotel.insertMany(initdata.data);
    console.log("data was initialized");
    // console.log(res)
})
// initDB()
// app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.set("view engine"  , "ejs")
app.set("views" , path.join(__dirname , "/views/listings"))
app.use(express.static(path.join(__dirname , "/public")))
const port = 8080;
app.use(express.urlencoded({extended:true}))

app.listen(port , ()=>{
    console.log("listening ...")
})
app.get("/" , (req , res)=>{
    res.redirect("/listings")
})
// app.get("/test" , async (req , res)=>{
//     let newlisting = new Listing({
//         title:"New Hotel" ,
//         description:"This is a nice hotel" ,
//         image: "https//wallpapers.com/images/hd/hotel-pictures-qlav23mu7ir1ch6j.jpg" , 
//         price :2000 ,
//         location:"Tirupati" ,
//         country:"India"
//     })
//     await newlisting.save()
//     res.send("working")
// })
// index route ........................................
app.get("/listings" , wrapAsync(async (req , res)=>{
    let allListings = await Hotel.find({})
    // console.log(allListings)
    res.render("listings.ejs" , {allListings})
}))
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

// create new listing route
app.get("/listings/new" ,  (req , res)=>{
    res.render("create.ejs");
})
// adding new list into database
app.post("/listings"  ,validateData , wrapAsync(async ( req , res , next)=>{
//    let ress = HotelSchema.validate(req.body)
//    console.log(ress)
//    if(ress.error){
//     throw new ExpressError(400 , ress.error)
//    }
     let newListing = new Hotel(req.body.listing);
    // console.log(newListing)
    let ans = await Hotel.insertOne(newListing);
    // console.log(ans)
    await newListing.save()
    res.redirect("listings")

   
  
}))
// route for each item
app.get("/listings/:id" , wrapAsync(async (req , res )=>{
    let {id} = req.params;
    let listing =  await Hotel.findById(id).populate("reviews")
    // console.log(id)
    // console.log("hi")
    res.render("show.ejs" ,{listing} )
}))
// edit route
app.get("/listings/:id/edit" , wrapAsync(async (req , res)=>{
    console.log("Form submitted"); 
  console.log("Request body:", req.body);
    let {id} = req.params;
    let listing = await Hotel.findById(id)
    // console.log(listing)
    res.render("edit.ejs" , {listing})
}))
// updata route
app.put("/listings/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Hotel.findByIdAndUpdate(id , {...req.body.listing})
    res.redirect("/listings")
}))
// Delete route
app.delete("/listings/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Hotel.findByIdAndDelete(id);
    res.redirect("/listings")
}))
// 
// review creation route
app.post("/listings/:id/reviews"  ,validateReview , wrapAsync(async (req , res , next)=>{
    let id = req.params.id;
    let listing = await Hotel.findById(id);
    let newReview = new Review (req.body.review)
    let reviewAdded = await newReview.save();
    await listing.reviews.push(newReview);
    let lisAndReview = await listing.save();
    console.log(lisAndReview);
    res.redirect(`/listings/${listing._id}`)
}))
app.use("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found"));
})
app.use((err , req , res , next)=>{
    let {statusCode=404 , message="page not found"} = err;
    res.status(statusCode).render("error.ejs" , {err});
})
// app.use("*" , (req , res , next)=>{
//     next(new ExpressError(404 , "page not found"))
// })
