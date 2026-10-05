import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },

        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            required: true
        },

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

        taxAmount: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: Number,
            required: true
        },

        transactionId: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["paid", "cancelled"],
            default: "paid"
        },

        invoiceDate: {
            type: Date,
            default: Date.now
        },

        pdfPath: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;