const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    cartKeys:Array,
    chatRooms:Array,
    created:{
        type:Date,
        default:Date.now,
    }
})


module.exports = mongoose.model('Users', postSchema)