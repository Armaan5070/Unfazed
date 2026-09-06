import express from "express"
import {getAvailableSchedule, bookAppointment, userSlug, checkClient } from "../controllers/client.controller.js";

const router = express.Router();

router.get("/:slug",userSlug);
router.get("/:slug/available",getAvailableSchedule);
router.get("/appointments/check-client/", checkClient)
router.post("/appointments/book",bookAppointment);
export default router;