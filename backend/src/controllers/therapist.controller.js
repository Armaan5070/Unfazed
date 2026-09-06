
import Appointment from "../models/booking.js";
import Client from "../models/client.js";
import Therapist from "../models/Therapist.js";
import Intake from "../models/intake.js";
import Session from "../models/session.js";
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userData = await Therapist.findOne({
            _id: userId
        }).select("-password_hash -createdAt -updatedAt")

        return res.status(202).json(userData);


    } catch (error) {
        return res.status(401).json({ message: "Not found" })
    }


}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = req.body;
        data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        const existingSlug = await Therapist.findOne({
            slug: data.slug,
            _id: { $ne: userId }
        })
        if (existingSlug) return res.status(400).json({ message: "Slug is already taken" });

        const updatedUser = await Therapist.updateOne(
            { _id: userId },
            {
                $set: {
                    name: data.name,
                    slug: data.slug,
                    bio: data.bio,
                    specializations: data.specializations,
                    languages: data.languages
                }
            }

        )

        if (updatedUser) return res.status(200).json({ message: "Saved Changes Successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Cannot update profile" });
    }
}

export const slugCheck = async (req, res) => {
    try {
        const { slug, _id } = req.query;
        const existingSlug = await Therapist.findOne({
            slug: slug,
            _id: { $ne: _id }
        });

        const CurrentUser = await Therapist.findOne({
            _id: _id
        })
        if (existingSlug) return res.status(200).json({ slugAvailable: false });
        else if (!existingSlug && CurrentUser.slug === slug) {
            return res.status(200).json({ slugAvailable: "" });
        }
        return res.status(200).json({ slugAvailable: true });

    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export const getClients = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { search, status } = req.query;

        // Base query: only this therapist's clients
        const query = {
            therapistId: userId
        };

        // Filter by status
        if (status && status !== "all") {
            query.status = status;
        }

        // Search by name, email, or phone
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const clients = await Client.find(query)
            .sort({ createdAt: -1 });

        return res.status(200).json(clients);

    } catch (error) {

        console.error("Get clients error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching clients."
        });
    }
};

export const getClientDesc = async (req, res) => {
    try {
        const { userId } = req.user;
        const { clientId } = req.params;

        const client = await Client.findOne({
            therapistId: userId,
            _id: clientId
        })

        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        const intake = await Intake.findOne({
            therapistId: userId,
            clientId: clientId
        });

        const allAppointments = await Appointment.find({
            therapistId: userId,
            clientId: clientId
        }).sort({ startTime: -1 });

        const lastSession = await Appointment.findOne({
            therapistId: userId,
            clientId: clientId,
            status: "completed"
        }).sort({ endTime: -1 });

        const sessions = await Session.find({
            therapistId: userId,
            clientId: clientId
        })
            .populate("appointmentId")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            client,
            intake,
            allAppointments,
            lastSession,
            sessions
        });
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const therapistId = req.user.userId;
        const { clientId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ["new", "active", "inactive"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const client = await Client.findOneAndUpdate(
            {
                _id: clientId,
                therapistId
            },
            {
                status
            },
            { returnDocument: 'after' }
        );

        if (!client) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        res.status(200).json(client);

    } catch (error) {
        res.status(500).json({
            message: "Error updating client status",
            error: error.message
        });
    }
}

export const createSession = async (req, res) => {
    try {
        const { userId } = req.user;

        const {
            clientId,
            appointmentId,
            notes,
            progress,
            currentConcerns
        } = req.body;

        // Required fields
        if (!clientId || !appointmentId || !notes) {
            return res.status(400).json({
                message: "Client, appointment and notes are required."
            });
        }

        // Check client belongs to therapist
        const client = await Client.findOne({
            _id: clientId,
            therapistId: userId
        });

        if (!client) {
            return res.status(404).json({
                message: "Client not found."
            });
        }

        // Check appointment belongs to this therapist and client
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            therapistId: userId,
            clientId: clientId
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found."
            });
        }

        // Only completed appointments can have session records
        if (appointment.status !== "completed"&&appointment.status !== "pending") {
            return res.status(400).json({
                message: "Session records can only be created for completed appointments."
            });
        }

        // Check if session already exists
        const existingSession = await Session.findOne({
            appointmentId
        });

        if (existingSession) {
            return res.status(409).json({
                message: "A session record already exists for this appointment."
            });
        }

        // Create session
        const session = await Session.create({
            therapistId: userId,
            clientId,
            appointmentId,
            notes: notes.trim(),
            progress: progress?.trim() || "",
            currentConcerns: currentConcerns?.trim() || ""
        });

        return res.status(201).json({
            message: "Session record created successfully.",
            session
        });

    } catch (error) {
        console.error("Create session error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating the session record."
        });
    }
};