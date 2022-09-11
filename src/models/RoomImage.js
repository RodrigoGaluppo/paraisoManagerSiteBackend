const mongoose = require('mongoose')

const RoomImageSchema = new mongoose.Schema({
    room_id: {type:String,required:true},
    filename:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
})

const RoomImageModel = mongoose.model('RoomImage',RoomImageSchema)

module.exports = RoomImageModel