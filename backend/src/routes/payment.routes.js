import express from "express"
import { createPaymentOrder, razorpayWebhook, verifyPayment } from "../controllers/payment.controller.js";


const router = express.Router();

router.post("/create-order", createPaymentOrder);
router.post("/verify-payment",verifyPayment);
router.post("/verify-webhook",razorpayWebhook);

export default router;