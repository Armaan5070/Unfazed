import Therapist from "../models/Therapist.js";
import schedule from "../models/schedule.js";
import Appointment from "../models/booking.js";
export const userSlug = async (req, res) => {
    try {

        const { slug } = req.params;


        const user = await Therapist.findOne({
            slug: slug
        }).select("-password_hash -createdAt -updatedAt")

        if (!user) {
            return res.status(404).json({ message: "Profile not found in database" });
        }

        return res.status(200).json({
            message: "Profile fetched successfull",
            data: user
        })
    } catch (error) {
        return res.status(404).json({ message: "Profile Not Found" })
    }


}

const getAvailableSchedule = async (req, res) => {
    const { date } = req.query;
    const { slug } = req.params;



try {
    const tp = await Therapist.findOne({ slug });
    
    if (!tp) {
        return res.status(404).json({
            message: "Therapist not found or deleted"
        });
    }
    
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const appointments = await Appointment.find({
        therapistId: tp._id,
        startTime: { $gte: start },
        endTime: { $lte: end }
    });

    
    const tpSchedule = await schedule.findOne({
        therapistId: tp._id
    });
    
    if (!tpSchedule) {
        return res.status(404).json({
            message: "Schedule not found"
        });
    }
 

        const formattedDate = new Date(`${date}T00:00:00.000Z`);

        const dayName = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            timeZone: "UTC"
        }).format(formattedDate);

        const daySchedule = tpSchedule.weeklySchedule.find(
            obj => obj.day === dayName.toLowerCase() && obj.isWorking === true
        );

        if (!daySchedule) {
            return res.status(404).json({
                message: "No available Schedule for this Day"
            });
        }
   

        const startDayTime = daySchedule.slots[0].startTime;
        const endDayTime = daySchedule.slots[0].endTime;

        const sessionTime = tpSchedule.sessionDurationMinutes;
        const bufferTime = tpSchedule.bufferTimeMinutes;


        let t = new Date(`${date}T${startDayTime}:00.000Z`);
        const endDay = new Date(`${date}T${endDayTime}:00.000Z`);

        const allSlots = [];

        while (t<endDay) {
            const slotStart = new Date(t);

            const slotEnd = new Date(t);
            slotEnd.setUTCMinutes(slotEnd.getUTCMinutes() + sessionTime);

            if (slotEnd > endDay) break;

            allSlots.push([slotStart, slotEnd]);

            t = new Date(slotEnd);
            t.setUTCMinutes(t.getUTCMinutes() + bufferTime);
        }
       
        const bookedSlots = appointments.map(app => [
            app.startTime,
            app.endTime
        ]);

        


        const availableSlots = allSlots.filter(([start, end]) =>
            !bookedSlots.some(([bookedStart, bookedEnd]) =>
                bookedStart.getTime() === start.getTime() &&
                bookedEnd.getTime() === end.getTime()
            )
        );

        
        return res.status(200).json({ availableSlots });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default getAvailableSchedule;