import mongoose from "mongoose";

const appointment = new mongoose.Schema({
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, unique: true },
    
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    clientPhone: {
        type: String,
        required: true,
        trim: true
    },

    // 3. Exact Slot Timings (Stored in UTC)
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    // 4. Appointment Status Pipeline
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    }
},
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointment);
export default Appointment