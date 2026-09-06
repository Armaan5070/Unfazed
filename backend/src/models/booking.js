import mongoose from "mongoose";

const appointment = new mongoose.Schema({
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required:true
    },


    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },


    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    bookedBy: {
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    }
}
},
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointment);
export default Appointment