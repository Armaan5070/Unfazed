import express from "express"
import { createSession, getClientDesc, getClients, getProfile, slugCheck, updateProfile, updateStatus } from "../controllers/therapist.controller.js";

const router = express.Router();

router.get('/profile/me',getProfile);
router.put('/profile/me',updateProfile);
router.get('/dashboard/slugcheck', slugCheck);
router.get('/clients/', getClients);
router.get('/clients/:clientId', getClientDesc);
router.patch('/clients/:clientId/status', updateStatus);
router.post('/sessions/create-session', createSession);
export default router;