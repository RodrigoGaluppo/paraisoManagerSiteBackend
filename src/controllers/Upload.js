const multer = require("multer")
const multerConfig = require("./multerconfig")
const upload = multer(multerConfig)
const RoomImageModel = require("../models/RoomImage.js")
const { extname,resolve } = require("path")

exports.single = async (req,res,next)=>{
    const uploadSingle = upload.single("room_image")

    const {room_id} = req.params

    return uploadSingle(req,res,async (errors)=>{
        if(errors)
        {
            return res.status(400).json({
                error:[errors]
            })
        }
        else
        {
           
            const filename = `${req.file.filename}`

            
            newRoomImage = new RoomImageModel({
                room_id,
                filename
            })
            await newRoomImage.save()
            return res.json(newRoomImage)
        }

        
    })
}

