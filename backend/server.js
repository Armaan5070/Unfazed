import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({path:'.env.local'})
dotenv.config();
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/auth.routes.js"
import clientRoutes from "./src/routes/client.routes.js"
import TherapistRoutes from "./src/routes/therapist.routes.js"
import scheduleRoutes from "./src/routes/schedule.routes.js"
import paymentRoutes from "./src/routes/payment.routes.js"
import { authMiddleware } from "./src/middlewares/auth.middleware.js";

const app = express();

const allowedOrigins = [     
  'http://localhost:5173',     
  process.env.VERCEL_FRONTEND 
];

app.use(cors({
  origin: allowedOrigins ,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
    "/verify-webhook",
    express.raw({ type: "application/json" })
);
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend API running");
})

app.use(AuthRoutes);
app.use('/therapist/',authMiddleware,TherapistRoutes)
app.use("/therapist/",authMiddleware,scheduleRoutes )
app.use(paymentRoutes);
app.use(clientRoutes);
const PORT= process.env.PORT;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server running at http://localhost:${PORT}`)
    })
})
