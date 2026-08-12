import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import AuthRoutes from "./routes/auth.routes.js"
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend API running");
})

app.use('/',AuthRoutes);
const PORT= process.env.PORT;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server running at http://localhost:${PORT}`)
    })
})
