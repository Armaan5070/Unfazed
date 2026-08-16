import express from "express"
import { userSlug } from "../controllers/client.controller.js";

const router = express.Router();

router.get("/:slug",userSlug);
export default router;