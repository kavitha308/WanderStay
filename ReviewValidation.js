const joi = require("joi")
module.exports .reviewsSchema = joi.object({
    reviews:joi.object({
    comment :joi.string().required() , 
    // rating: joi.number().min(1).max(5).required(), 
    })
})
