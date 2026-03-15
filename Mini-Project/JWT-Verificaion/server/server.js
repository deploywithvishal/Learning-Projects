import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.route.js";

const app =  express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/JWT-Verification")
.then(()=> console.log("MongoDB Connected..."))
.catch(err => console.log("Error: ",err));

app.use("/auth", authRoutes)

app.listen(3000,()=>{
    console.log("Server Start...");
})