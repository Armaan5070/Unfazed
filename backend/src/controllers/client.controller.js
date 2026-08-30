import { fromZonedTime } from "date-fns-tz";
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


export const getAvailableSchedule = async (req, res) => {
    const { date } = req.query;
    const { slug } = req.params;

    try {
        const tp = await Therapist.findOne({ slug });

        if (!tp) {
            return res.status(404).json({
                message: "Therapist not found or deleted"
            });
        }

        const tpSchedule = await schedule.findOne({
            therapistId: tp._id
        });

        if (!tpSchedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }
const isBlocked = tpSchedule.blockedDates.some(
    d => d.toISOString().split("T")[0] === date
);

if (isBlocked) {
    return res.status(200).json([]);
}

        const formattedDate = new Date(`${date}T12:00:00Z`);

        const dayName = new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            timeZone: tpSchedule.timeZone
        }).format(formattedDate);

        const daySchedule = tpSchedule.weeklySchedule.find(
            obj =>
                obj.day === dayName.toLowerCase() &&
                obj.isWorking === true
        );

        if (!daySchedule) {
            return res.status(404).json({
                message: "No available Schedule for this Day"
            });
        }

        const sessionTime = tpSchedule.sessionDurationMinutes;
        const bufferTime = tpSchedule.bufferTimeMinutes;
        const timeZone = tpSchedule.timeZone;

        const allSlots = [];

       //fromZonedTime converts to utc 

        for (const slot of daySchedule.slots) {

            let t = fromZonedTime(
                `${date} ${slot.startTime}`,
                timeZone
            );

            const endDay = fromZonedTime(
                `${date} ${slot.endTime}`,
                timeZone
            );

            while (t < endDay) {

                const slotStart = new Date(t);

                const slotEnd = new Date(t);

                slotEnd.setUTCMinutes(
                    slotEnd.getUTCMinutes() + sessionTime
                );

                if (slotEnd > endDay) {
                    break;
                }

                allSlots.push([
                    slotStart,
                    slotEnd
                ]);

                t = new Date(slotEnd);

                t.setUTCMinutes(
                    t.getUTCMinutes() + bufferTime
                );
            }
        }
        const appointments = await Appointment.find({
            therapistId: tp._id,
            status: {
                $in: ["pending", "confirmed"]
            },
            startTime: {
                $lt: new Date(`${date}T23:59:59.999Z`)
            },
            endTime: {
                $gt: new Date(`${date}T00:00:00.000Z`)
            }
        });



        const availableSlots = allSlots.filter(
            ([start, end]) =>
                !appointments.some(
                    appointment =>
                        appointment.startTime < end &&
                        appointment.endTime > start
                )
        );

        return res.status(200).json(
            availableSlots
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};





export const bookAppointment = async (req, res) => {
    try {
        const {
            slug,
            startTime,
            endTime,
            clientName,
            clientEmail,
            clientPhone,
        } = req.body;
        if (
            !slug ||
            !startTime ||
            !endTime ||
            !clientName ||
            !clientEmail ||
            !clientPhone
        ) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        const therapist = await Therapist.findOne({ slug });

        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found.",
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid appointment time.",
            });
        }

        if (end <= start) {
            return res.status(400).json({
                message: "Invalid appointment duration.",
            });
        }

        const existingAppointment = await Appointment.findOne({
            therapistId: therapist._id,

            status: {
                $in: ["pending", "confirmed"],
            },

            startTime: {
                $lt: end,
            },

            endTime: {
                $gt: start,
            },
        });

        if (existingAppointment) {
            return res.status(409).json({
                message: "This appointment slot is no longer available.",
            });
        }


        const appointment = await Appointment.create({
            therapistId: therapist._id,

            clientName,
            clientEmail,
            clientPhone,

            startTime: start,
            endTime: end,

            // Explicitly pending
            status: "pending",
        });

        return res.status(201).json({
            message: "Appointment created successfully.",
            appointment,
        });

    } catch (error) {
        console.error("Book appointment error:", error);

        return res.status(500).json({
            message: "Something went wrong while booking the appointment.",
        });
    }
};

export default bookAppointment;