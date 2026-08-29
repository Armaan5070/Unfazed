import schedule from "../models/schedule.js";
import Appointment from "../models/booking.js";
export const getSchedule = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userSchedule = await schedule.findOne({
            therapistId: userId,
        }).lean();

        if (!userSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }

        delete userSchedule.therapistId;

        return res.status(200).json(userSchedule);

    } catch (error) {
        return res.status(400).json({ message: "Server error cant fetch schedule" })
    }
}

export const makeSchedule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updatedData = req.body;
        updatedData.therapistId = userId;

        const savedSchedule = await schedule.findOneAndUpdate(
            { therapistId: userId },
            { $set: updatedData },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return res.status(200).json({
            message: "Schedule updated/created Successfully",
            schedule: savedSchedule
        });
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

