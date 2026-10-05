import express from "express"
import {getAvailableSchedule, bookAppointment, userSlug, checkClient } from "../controllers/client.controller.js";

const router = express.Router();

router.get("/appointments/check-client/", checkClient)
router.post("/appointments/book",bookAppointment);
router.get("/client/:slug/available",getAvailableSchedule);
router.get("/client/:slug",userSlug);
export default router;