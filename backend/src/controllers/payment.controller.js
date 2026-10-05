import razorpay from "../config/razorpay.js";
import Appointment from "../models/booking.js";
import Payment from "../models/payment.js";
import Therapist from "../models/Therapist.js";
import Client from "../models/client.js";
import { generateInvoicePDF } from "../services/invoiceservice.js";
import Invoice from "../models/invoice.js";
import crypto from "crypto";
import SESSION_PRICE from "../config/session-price.js";

export const createPaymentOrder = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                message: "Appointment ID is required."
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found."
            });
        }

        const amount = SESSION_PRICE;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `appointment_${appointment._id}`
        });

        const payment = await Payment.create({
            appointmentId: appointment._id,
            clientId: appointment.clientId,
            therapistId: appointment.therapistId,

            orderId: order.id,

            amount: amount,

            status: "created"
        });

        return res.status(201).json({
            message: "Payment order created.",
            orderId: order.id,
            amount: amount,
            currency: "INR",
            paymentId: payment._id
        });

    } catch (error) {
        console.error("Create payment order error:", error);

        return res.status(500).json({
            message: "Could not create payment order."
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification data is missing."
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed."
            });
        }

        const payment = await Payment.findOne({
            orderId: razorpay_order_id
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found."
            });
        }

        payment.gatewayTransactionId = razorpay_payment_id;
        payment.status = "successful";

        await payment.save();

        return res.status(200).json({
            message: "Payment verified successfully."
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        return res.status(500).json({
            message: "Could not verify payment."
        });
    }
};

export const razorpayWebhook = async (req, res) => {
    try {
        const webhookSignature =
            req.headers["x-razorpay-signature"];

        if (!webhookSignature) {
            return res.status(400).json({
                message: "Webhook signature missing."
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(req.body)
            .digest("hex");

        if (generatedSignature !== webhookSignature) {
            return res.status(400).json({
                message: "Invalid webhook signature."
            });
        }

        const event = JSON.parse(req.body.toString());

        console.log("Razorpay webhook event:", event.event);

        if (event.event === "payment.captured") {

    const razorpayPaymentId =
        event.payload.payment.entity.id;

    const razorpayOrderId =
        event.payload.payment.entity.order_id;

    // Find our payment record
    const payment = await Payment.findOne({
        orderId: razorpayOrderId
    });

    if (!payment) {
        return res.status(404).json({
            message: "Payment record not found."
        });
    }

    // =========================
    // PAYMENT
    // =========================

    payment.gatewayTransactionId =
        razorpayPaymentId;

    payment.status = "successful";

    await payment.save();

    console.log("Payment marked successful.");

    // =========================
    // APPOINTMENT
    // =========================

    const appointment = await Appointment.findById(
        payment.appointmentId
    );

    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found."
        });
    }

    appointment.status = "confirmed";

    await appointment.save();

    console.log("Appointment confirmed.");

    // =========================
    // CHECK EXISTING INVOICE
    // =========================

    let invoice = await Invoice.findOne({
        paymentId: payment._id
    });

    // =========================
    // CREATE INVOICE
    // =========================

    if (!invoice) {

        const client = await Client.findById(
            payment.clientId
        );

        const therapist = await Therapist.findById(
            payment.therapistId
        );

        if (!client || !therapist) {
            return res.status(404).json({
                message: "Client or therapist not found."
            });
        }

        // Temporary invoice number generation
        const invoiceNumber =
            `INV-${Date.now()}`;

        invoice = await Invoice.create({
            invoiceNumber,

            paymentId: payment._id,
            appointmentId: payment.appointmentId,
            clientId: payment.clientId,
            therapistId: payment.therapistId,

            amount: payment.amount,
            platformFee: payment.platformFee,
            netAmount: payment.netAmount,

            taxAmount: 0,

            totalAmount: payment.amount,

            transactionId: payment.gatewayTransactionId,

            status: "paid"
        });

        console.log(
            "Invoice created:",
            invoice.invoiceNumber
        );

        // =========================
        // GENERATE PDF
        // =========================

        const pdfPath = await generateInvoicePDF(
            invoice,
            client,
            therapist,
            appointment
        );

        invoice.pdfPath = pdfPath;

        await invoice.save();

        console.log(
            "Invoice PDF generated:",
            pdfPath
        );
    }
}

        return res.status(200).json({
            message: "Webhook processed successfully."
        });

    } catch (error) {
        console.error("Webhook error:", error);

        return res.status(500).json({
            message: "Webhook processing failed."
        });
    }
};