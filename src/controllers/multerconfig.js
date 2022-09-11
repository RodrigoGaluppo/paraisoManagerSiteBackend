const multer = require("multer")
const { extname,resolve } = require("path")

module.exports = {
    fileFilter:(req,file,cb)=>{
        
     

        if(file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" )
        {
            return cb(new multer.MulterError("file must be either PNG or JPG"))
        }
        return cb(null,true)
    },
    
    storage: multer.diskStorage({
        
        destination:(req,file,cb)=>{
            cb(null,resolve(__dirname,"..","..","public","images"))
        },
        filename:(req,file,cb)=>{
            const room_id = req.params.room_id
            cb(null, `${room_id}_${Date.now()}${extname(file.originalname)}`  )
        }
    })
    
    
}