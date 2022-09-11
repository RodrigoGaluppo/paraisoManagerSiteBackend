const UserModel = require("../models/UserModel")
const next = require("express")
const verify = require("jsonwebtoken").verify
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv/config")

const salt = bcrypt.genSaltSync(5)
const JWTSECRET = process.env.JWTSECRET

exports.auth = async (req,res,next)=>{
    
    const JWTSECRET = process.env.JWTSECRET
    const authToken = req.headers["authorization"]

    if(!!authToken){
        const bearer = authToken.split(" ")
        const token = bearer[1]
        
        if(JWTSECRET){
            try{
                const decoded = await verify(token,JWTSECRET)   
                         
                if(decoded){
                    const { sub } = decoded 
                    req.user = {
                        id:sub
                    }
                    
                    next()
                }
            }catch(e){
                return res.json({message:"Invalid Token"}).status(401)
            }
        }
        
    }else{
        res.status(401)
        return res.json({message:"authentication is required"})
    }

}

exports.login =  async (req,res)=>{

    const {email,password} = req.body

    if(email == undefined || password == undefined)
        return res.status(400).json({message:"error"})

    const user = await UserModel.findOne({"email":email})

    if(user){

        if(bcrypt.compareSync(password,user.get("password"))){
            
            if(JWTSECRET){
                jwt.sign({user_id:user.get("user_id")},JWTSECRET,{subject:user.get("_id").toString(),expiresIn:"1d"},(err,token)=>{
                    if(err){

                        res.status(500)
                        return res.json({message:"internal error"}).status(500)
                    }
                    
                    const userObj = {
                        name:user.name,
                        email:user.email,
                        id:user.id,
                        menuName:user.get("menuName"),
                        bgColor:user.get("bgColor"),
                        frontColor:user.get("frontColor"),
                        fontColor:user.get("fontColor")
                    }

                    return res.json({token,user:userObj})
                })
                
            }else{
                res.status(500)
                return res.json({message:"internalError"})
            }
            
        }else{
            res.status(404)
            return res.json({message:"invalid Credentials"})
        }
        
    }else{
        res.status(401)
        return res.json({message:"user not found"})
    } 
}

exports.update = async (req,res)=>{

    const user_id = req.user.id
    const name = req.body.name
    const email = req.body.email
  
  
    UserModel.findOneAndUpdate(
        {
            "_id":user_id
        },{
        name,
        email
    })
    .then((user)=>{
        if(user){
            
            user.save()
            const resUser = {
                name:user.name,
                email:user.email,
                id:user._id
            }
            return res.json(resUser)
        }else{

            return res.json({message:"user does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        console.log(err);         
        res.status(400)
        return res.json({message:"user does not exist"})
    })  
}

exports.delete = async (req,res)=>{
    const user_id = req.user.id
        
    UserModel.findOneAndDelete({"_id":user_id})
    .then((user)=>{
        if(user){
            user.save()
            const resUser = {
                user_id:user.get("_id"),
                name:user.get("name")
            }
            return res.json({user:resUser})
        }else{
            return res.json({message:"user does not exist"}) 
        }
    }) 
    .catch(()=>{          
        res.status(400)
        return res.json({message:"user does not exist"})
    })  
}

exports.create = async (req,res)=>{
    const {name, email ,password} = req.body
        UserModel.findOne({"email":email})
        .then((userExists)=>{
            if(userExists){
                res.status(400)
                return res.json({message:"email already in use"})
            }

            bcrypt.hash(password,salt, async function(err,hash){
                if(err){
                    console.log(err);
                    res.status(400)
                    return res.json({message:"an error ocurred"})
                }

                const user = new UserModel({email,name,password:hash})

                user.save()
                .then(async ()=>{
                    
                    return res.json({
                        name:user.name,
                        email:user.email,
                        id:user.id
                    }) 
                })
                .catch((e)=>{
                    console.log(e);
                })
                
            })       
            
        })
        .catch(()=>{
            console.log(e);
            res.status(400)
            return res.json({message:"internal server error"})
        })
}