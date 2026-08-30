import express from "express"
import {getAvailableSchedule, bookAppointment, userSlug } from "../controllers/client.controller.js";

const router = express.Router();

router.get("/:slug",userSlug);
router.get("/:slug/available",getAvailableSchedule);
router.post("/appointments/book",bookAppointment);
export default router;