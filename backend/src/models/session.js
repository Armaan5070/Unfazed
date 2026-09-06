import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },

        notes: {
            type: String,
            required: true,
            trim: true
        },

        progress: {
            type: String,
            trim: true,
            default: ""
        },

        currentConcerns: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;