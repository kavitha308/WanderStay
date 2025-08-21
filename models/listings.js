const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HotelSchema = new Schema({
    title :{
        type :String
      } , 
    description :{
        type: String
      } , 
    image: {
  type: String , 
  default: "https://wallpapers.com/images/hd/hotel-pictures-qlav23mu7ir1ch6j.jpg" , 
  set:(v) =>
      v === ""?"https://wallpapers.com/images/hd/hotel-pictures-qlav23mu7ir1ch6j.jpg": v,
  
},
    price :{
        type:Number , 
        default:0
      } , 
    location:{
        type:String
    } , 
    country :{type:String} , 
    reviews:[
      {
        type:Schema.Types.ObjectId , 
        ref : "Review"
      }
    ]
})
const Hotel = new mongoose.model( "Hotel", HotelSchema);
module.exports =  Hotel