import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.model.js"
import authMiddleware from "../middleware/authMiddleware.middleware.js";

const router = express.Router();

const SECRET = "mysecretkey";

router.post("/register", async(req, res)=>{
    const {name, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
        name,
        email,
        password:hashedPassword
    })

    await user.save();

    res.json({
        message:"User Registered"
    })
})


router.post("/login", async(req,res)=>{
    const {email, password} =  req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign(
        {id:user._id},
        SECRET,
        {expiresIn:"1h"}
    )

    res.json({
        message:"Login Success",
        token
    })
})


// PROTECTED ROUTE
router.get("/home", authMiddleware , (req,res)=>{

    res.json({
        message:"Welcome to Home Page"
    })
    
})

export default router;