const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    procurerId:String,
    userId:String,
    procureruserId:String,
    orderId:String,
    items:Array,
    orderSent:Boolean,
    orderAccepted:Boolean,
    orderDelivered:Boolean,
    orderConfirmed:Boolean,
    chosenPaymentName:String,
    locationName:String,
    locationCoordinates:Object,
    location:String,
    paymentMethod:String,
    created:{
        type:Date,
        default:Date.now,
    }
})




module.exports = mongoose.model('Cart', postSchema)