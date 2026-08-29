import express from "express"
import getAvailableSchedule, { userSlug } from "../controllers/client.controller.js";

const router = express.Router();

router.get("/:slug",userSlug);
router.get("/:slug/available",getAvailableSchedule);
export default router;