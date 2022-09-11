const RoomImageModel = require("../models/RoomImage")
const RoomModel = require("../models/RoomModel")
const fs = require("fs")
const { resolve } = require("path")
const { constants } = require("buffer")

exports.list = async (req,res)=>{

    const roomsObj = []

   
    RoomModel.find({})
    .then((rooms)=>{
        rooms.map((room)=>{
            
            
            
        })
        return res.json({"rooms":rooms})
    })
    .catch((err)=>{
        res.status(500)
        return res.json({"err":"could not load the snacks"})
    })
    
}

exports.index = (req,res)=>{

    const roomid = req.params.room_id
    
    RoomModel.findOne({"_id":roomid})
    .then(async (room)=>{

        const images = await RoomImageModel.find({room_id:roomid})

        return res.json({"room":room,"images":images})
    })
    .catch(()=>{
        res.status(500)
        return res.json({"err":"could not load the room"})
    })

}

exports.update = async (req,res)=>{

    const roomid = req.body.room_id
    let name = req.body.name
    let description = req.body.description
    let short_description = req.body.short_description
    let prices = req.body.prices
    
    RoomModel.findById(roomid)
    .then( async (room)=>{
        
        if(description == "")
            description = room.description

        if(name == "")
            name = room.name

        if(short_description == "")
            short_description = room.short_description

        if(prices == "")
            prices = room.prices

        room.updateOne({name:name, description:description, prices:prices,short_description:short_description }).
        then(async ()=>{
            const roomObj = await RoomModel.findById(room._id)
            const images = await RoomImageModel.find({room_id:roomid})
    
            return res.json({"room":roomObj,"images":images})
        })
        .catch((err)=>{
            console.log(err);
            res.status(500)
            return res.json({"err":"could not find the snack"})
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500)
        return res.json({"err":"could not find the snack"})
    })
}

exports.delete = (req,res)=>{

    const roomid = req.params.room_id

    RoomModel.findOneAndDelete({"_id":roomid})
    .then((room)=>{
        
        return res.json({"rooms":room})
    })
    .catch(()=>{
        res.status(500)
        return res.json({"err":"could not delete the room"})
    })
}

exports.deletePhoto = (req,res)=>{

    const roomid = req.params.roomPhoto_id

    RoomImageModel.findOneAndDelete({"_id":roomid})
    .then((roomImage)=>{
        fs.unlink(resolve("..","..","public","images",roomImage.filename), ()=>{
            return res.json({"room":roomImage})
        })
        
    })
    .catch(()=>{
        res.status(500)
        return res.json({"err":"could not delete the room"})
    })
}



exports.create = async (req,res)=>{
    

    const name = req.body.name
    const prices = req.body.prices
    const description = req.body.description
    const short_description = req.body.short_description

    roomModel = new RoomModel({name: name, description:description,short_description:short_description, prices: prices})
    roomModel.save()
    .then((room)=>{
        return res.json({"room":room})
    })
    .catch((err)=>{
        console.log(err);
        res.status(500)
        return res.json({"message":"could not create the room"})
    })

}