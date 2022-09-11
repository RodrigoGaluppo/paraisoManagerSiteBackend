const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    name:{type:String,required:true},
    short_description:{type:String,required:true},
    description: {type:String,required:true},
    prices:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
})

const RoomModel = mongoose.model('Room',RoomSchema)

module.exports = RoomModel