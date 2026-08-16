import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/auth.routes.js"
import clientRoutes from "./src/routes/client.routes.js"
import TherapistRoutes from "./src/routes/therapist.routes.js"
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend API running");
})

app.use(AuthRoutes);
app.use('/therapist/',authMiddleware,TherapistRoutes)
app.use(clientRoutes);
const PORT= process.env.PORT;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server running at http://localhost:${PORT}`)
    })
})
