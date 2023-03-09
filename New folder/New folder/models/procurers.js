const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    id:String,
    name:String,
    username:String,
    email:String,
    about:String,
    vehiclesUsed:Array,
    productType:Array,
    ingredients:Array,
    utensils:Array,
    link:String,
    image:String,
    coverimage:String,
    location:String,
    testimonials:Array,
    chatRooms:Array,
    otp:String,
    firebaseId:String,
    deal:Array,  
    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Procurers', postSchema)