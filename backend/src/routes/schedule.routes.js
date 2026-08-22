import express from "express";
import { getSchedule, makeSchedule } from "../controllers/scheduling.controller.js";

const router = express.Router();

router.get("/schedule",getSchedule);
router.put("/schedule",makeSchedule)
export default router;