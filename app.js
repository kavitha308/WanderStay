const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {HotelSchema} = require("./SchemaValidation.js")
const {reviewsSchema} = require("./ReviewValidation.js")
const engine = require("ejs-mate")

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js")

const session = require("express-session")
const flash = require("connect-flash")

const passport = require("passport")
const localStrategy=require("passport-local")
const User = require("./models/user.js")

app.engine("ejs" , engine)
//////////////////////////////////////////////////////////////////////////////////////////
const initdata = require("./init/initData.js")
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

app.use(methodOverride("_method"))
app.set("view engine"  , "ejs")
app.set("views" , path.join(__dirname , "/views/listings"))
app.use(express.static(path.join(__dirname , "/public")))
app.use(express.urlencoded({extended:true}))


const sessionOptions = {
    secret : "mysecret" ,
    resave:false ,
    saveUninitialized:true, 
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000 ,
        httpOnly:true
    }
}
app.use(session(sessionOptions))
app.use(flash()) //this msg must be written before all the routes in the project
  
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

app.get("/demouser" , async (req , res)=>{
    let fakeUser = new User({
        email:"abc@gmail.com" , 
        username:"abc"
    })
    let registeredUser = await User.register(fakeUser , "helloworld")
    res.send(registeredUser)
})


app.use("/listings" , listings)
app.use("/listings/:id/reviews" , reviews)
app.use("/" , users)

app.listen(3000, ()=>{
    console.log("listening ...")
})  


app.use("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found"));
})
app.use((err , req , res , next)=>{
    let {statusCode=404 , message="page not found"} = err;
    res.status(statusCode).render("error.ejs" , {err});
})

