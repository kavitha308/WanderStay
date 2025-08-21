const initdata = require("./initData.js")
const mongoose  = require("mongoose")
const Hotel = require("../models/listings.js")
main()
.then(()=>{
    console.log("connection successful... .")
})
.catch((e)=>{
    console.log(e)
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnbb")
}
const initDB = async()=>{
    await Hotel.deleteMany({});
   let res =  await Hotel.insertMany(initdata.data);
    console.log("data was initialized");
    console.log(res)
}
initDB()