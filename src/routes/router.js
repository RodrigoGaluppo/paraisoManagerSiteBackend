const Router = require("express").Router
const RoomController = require("../controllers/RoomController")
const UserController = require("../controllers/UserController")
const UploadController = require("../controllers/Upload")
const router = new Router();

router.get("/room/:room_id",RoomController.index)
router.get("/room/",RoomController.list)
router.post("/room",RoomController.create)
router.put("/room",RoomController.update)
router.delete("/room/:room_id",RoomController.delete)

router.post("/user",UserController.auth,UserController.create)
router.put("/user",UserController.auth,UserController.update)
router.delete("/user",UserController.auth,UserController.delete)

router.post("/room/upload/:room_id",UploadController.single)
router.delete("/roomPhoto/:roomPhoto_id",UserController.auth,RoomController.deletePhoto)

router.post("/login",UserController.login)


module.exports = router