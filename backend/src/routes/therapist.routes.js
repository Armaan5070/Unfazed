import express from "express"
import { getProfile, updateProfile } from "../controllers/therapist.controller";

const router = express.Router();

router.get('/profile/me',getProfile);
router.put('/profile/me',updateProfile);

export default router;