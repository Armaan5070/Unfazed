import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true
        },

        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        // Razorpay order ID
        orderId: {
            type: String,
            required: true
        },

        // Razorpay payment ID
        gatewayTransactionId: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        platformFee: {
            type: Number,
            default: 0
        },

        netAmount: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "created",
                "pending",
                "successful",
                "failed",
                "refunded"
            ],
            default: "created"
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;