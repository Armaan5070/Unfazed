import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  startTime: { type: String },
  endTime: { type: String },
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  isWorking: { type: Boolean, default: false },
  slots: [slotSchema]
});

const scheduleSchema = new mongoose.Schema({
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, unique: true },
  sessionDurationMinutes: { type: Number, default: 50 },
  bufferTimeMinutes: { type: Number, default: 10 },
  weeklySchedule: [dayScheduleSchema],
  minimumAdvanceTime:{type:Number, default:0},
  timeZone: { type: String, required: true },
  blockedDates: [{ type: Date }]
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);