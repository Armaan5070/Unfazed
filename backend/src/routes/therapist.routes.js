import express from "express"
import { getProfile, slugCheck, updateProfile } from "../controllers/therapist.controller.js";

const router = express.Router();

router.get('/profile/me',getProfile);
router.put('/profile/me',updateProfile);
router.get('/dashboard/slugcheck', slugCheck);

export default router;