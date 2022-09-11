const express = require("express")
const app = express()
const router = require("./src/routes/router")
const bodyparser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const RoomModel = require("./src/models/RoomModel")
const RoomImageModel = require("./src/models/RoomImage")

require("dotenv/config")

mongoose.connect(process.env.MongooseString,{useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:false})
.then(()=>{
    app.emit('ready')
})

.catch(e=>console.log(e))
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cors())
app.set("view engine","ejs")
app.set("views","./views")

//app.get("/menu/:userid",MenuController.render)

app.get("/",async (req,res)=>{
    rooms = await RoomModel.find({})

    let roomsResponse = []
    
    let myPromise = new Promise(function(myResolve, myReject) {
        let c = 0;
        
        rooms.forEach(async (room)=>{
            roomImage = await RoomImageModel.findOne({room_id:room._id})
            
            const roomImageAddress = !!roomImage ? `/images/${roomImage.filename}` : "https://s2.glbimg.com/QA7LmbS-ozlHO2u_9v3UbxbSr2A=/620x455/e.glbimg.com/og/ed/f/original/2021/06/29/ipiranga0184.jpg"
            
            room = {...room, roomImageAddress}

            c++;
            roomsResponse.push(room);
            if(c == 3 || c == rooms.length)
                myResolve();
        })
        
    });
    
    
    myPromise.then(()=>{
        return res.render("index.ejs",{
            rooms:roomsResponse
        })
    })
})

app.get("/rooms/:room_id",async (req,res)=>{
    const room_id = req.params.room_id

    room = await RoomModel.findById(room_id)

    const images = await RoomImageModel.find({room_id:room_id})

    return res.render("room.ejs",{
        room:room,
        images:images
    })
})

app.get("/rooms",async (req,res)=>{
    rooms = await RoomModel.find({})

    let roomsResponse = []
    
    let myPromise = new Promise(function(myResolve, myReject) {
        let c = 0;
        
        rooms.forEach(async (room)=>{
            roomImage = await RoomImageModel.findOne({room_id:room._id})
            
            const roomImageAddress = !!roomImage ? `/images/${roomImage.filename}` : "https://s2.glbimg.com/QA7LmbS-ozlHO2u_9v3UbxbSr2A=/620x455/e.glbimg.com/og/ed/f/original/2021/06/29/ipiranga0184.jpg"
            
            room = {...room, roomImageAddress}

            c++;
            roomsResponse.push(room);
            if(c == rooms.length)
                myResolve();
        })
        
    });
    
    
    myPromise.then(()=>{
        return res.render("rooms.ejs",{
            rooms:roomsResponse
        })
    })

    
})

app.use(router)
app.on('ready',()=>{
    app.listen(process.env.PORT || 3333,(req,res)=>{
        console.log('working')
    })
})