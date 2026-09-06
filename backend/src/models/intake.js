import mongoose from "mongoose";

const intakeSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
            unique: true
        },

        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        // Personal details
        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        // Reason for therapy
        presentingConcern: {
            type: String,
            required: true,
            trim: true
        },

        goalsForTherapy: {
            type: String,
            trim: true
        },

        // Background
        previousTherapy: {
            type: String,
            trim: true
        },

        relevantHistory: {
            type: String,
            trim: true
        },

        // Emergency contact
        emergencyContact: {
            name: {
                type: String,
                trim: true
            },

            relationship: {
                type: String,
                trim: true
            },

            phone: {
                type: String,
                trim: true
            }
        },

        // Consent
        consent: {
            accepted: {
                type: Boolean,
                required: true
            },

            acceptedAt: {
                type: Date
            }
        }
    },
    {
        timestamps: true
    }
);

const Intake = mongoose.model("Intake", intakeSchema);
export default Intake;