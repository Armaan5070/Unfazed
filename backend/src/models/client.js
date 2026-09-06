import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
    {
        therapistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Therapist",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["new", "active", "inactive"],
            default: "new"
        },

        tags: {
            type: [String],
            default: []
        },
        intakeToken: {
            type: String
        },

        intakeTokenExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)


const Client = mongoose.model("Client", ClientSchema);
export default Client;