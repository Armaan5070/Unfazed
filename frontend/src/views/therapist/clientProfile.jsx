import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosInstance"
import { useToast } from "../../context/toastContext";
import Navbar from "../../components/navbar"
export default function ClientProfile() {
    const { clientId } = useParams();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [clientStatus, setClientStatus] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [sessionData, setSessionData] = useState({
        notes: "",
        progress: "",
        currentConcerns: ""
    });
    const { showToast } = useToast();
    useEffect(() => {
        const fetchClientProfile = async () => {
            try {
                const response = await api.get(`therapist/clients/${clientId}`);
                const data = response.data;
                setClientData(data);
                setClientStatus(data.client.status);


            } catch (error) {
                setError(error?.response?.data?.message);
                showToast(error?.response?.data?.message || "something went wrong", "error")
            } finally {
                setLoading(false);
            }
        }
        fetchClientProfile();
    }, [clientId])

    const handleStatusChange = async (e) => {
        const value = e.target.value;

        try {
            const response = await api.patch(
                `/therapist/clients/${clientId}/status`,
                { status: value }
            );

            const data = response.data;

            setClientStatus(data.status);

            showToast("Status Updated Successfully");

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Something went wrong.",
                "error"
            );
        }
    };


    const handleSessionChange = (e) => {
        const { name, value } = e.target;

        setSessionData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/therapist/sessions/create-session",
                {
                    clientId,
                    appointmentId: selectedAppointment._id,
                    ...sessionData
                }
            );

            showToast(response.data.message);

            // Refresh the profile so sessions are fetched again
            const profileResponse = await api.get(
                `/therapist/clients/${clientId}`
            );

            const data = profileResponse.data;

            setClientData(data);

            // Clear the form
            setSessionData({
                notes: "",
                progress: "",
                currentConcerns: ""
            });

            // Close the form
            setSelectedAppointment(null);

        } catch (error) {

            showToast(
                error.response?.data?.message ||
                "Could not create session record.",
                "error"
            );
        }
    };
    const getAppointmentStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "confirmed":
                return "bg-blue-100 text-blue-700";

            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    if (loading) {
        return (
            <>
                <h1>Loading Client Profile ..........</h1>
            </>
        )
    }
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">

                <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">

                    <div className="rounded-xl bg-white p-8 text-center shadow-sm">

                        <h2 className="text-xl font-semibold text-gray-900">
                            Unable to Load Client
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {error}
                        </p>

                    </div>

                </div>

            </div>
        );
    }
    const { client, intake, allAppointments, lastSession, sessions } = clientData;
    const hasSession = (appointmentId) => {
        return sessions.some(
            (session) =>
                session.appointmentId?._id === appointmentId
        );
    };
    const getClientStatusStyle = (status) => {
        switch (status) {
            case "new":
                return "bg-blue-100 text-blue-700";

            case "active":
                return "bg-green-100 text-green-700";

            case "inactive":
                return "bg-gray-200 text-gray-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-6">

                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                            <p className="mb-1 text-sm text-gray-500">
                                Client Profile
                            </p>

                            <div className="flex items-center gap-3">

                                <h1 className="text-3xl font-bold text-gray-900">
                                    {client.name}
                                </h1>

                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${getClientStatusStyle(
                                        clientStatus
                                    )}`}
                                >
                                    {clientStatus}
                                </span>

                            </div>

                        </div>


                        {/* Status selector */}
                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-gray-500">
                                Change Status
                            </label>

                            <select
                                name="status"
                                id="status"
                                value={clientStatus}
                                onChange={handleStatusChange}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-black"
                            >
                                <option value="new">New</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                        </div>

                    </div>


                    {/* Client Basic Information */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Client Information
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {client.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Phone
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {client.phone}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Last Session */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-2 text-lg font-semibold text-gray-900">
                            Last Completed Session
                        </h2>

                        <p className="text-gray-600">
                            {lastSession
                                ? new Date(
                                    lastSession.startTime
                                ).toLocaleString()
                                : "No completed sessions yet"}
                        </p>

                    </div>


                    {/* Intake Information */}
                    {intake ? (
                        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-6 text-lg font-semibold text-gray-900">
                                Intake Information
                            </h2>


                            {/* Personal Information */}
                            <div className="mb-8">

                                <h3 className="mb-4 font-medium text-gray-900">
                                    Personal Information
                                </h3>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date of Birth
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.dateOfBirth
                                                ? new Date(
                                                    intake.dateOfBirth
                                                ).toLocaleDateString()
                                                : "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Gender
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.gender || "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Address
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.address || "Not provided"}
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* Therapy Information */}
                            <div className="border-t border-gray-100 pt-6">

                                <h3 className="mb-4 font-medium text-gray-900">
                                    Therapy Information
                                </h3>

                                <div className="space-y-5">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Presenting Concern
                                        </p>

                                        <p className="mt-1 leading-relaxed text-gray-800">
                                            {intake.presentingConcern ||
                                                "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Goals for Therapy
                                        </p>

                                        <p className="mt-1 leading-relaxed text-gray-800">
                                            {intake.goalsForTherapy ||
                                                "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Previous Therapy
                                        </p>

                                        <p className="mt-1 leading-relaxed text-gray-800">
                                            {intake.previousTherapy ||
                                                "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Relevant History
                                        </p>

                                        <p className="mt-1 leading-relaxed text-gray-800">
                                            {intake.relevantHistory ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* Emergency Contact */}
                            <div className="mt-8 border-t border-gray-100 pt-6">

                                <h3 className="mb-4 font-medium text-gray-900">
                                    Emergency Contact
                                </h3>

                                <div className="grid gap-5 sm:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Name
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.emergencyContact?.name ||
                                                "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Relationship
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.emergencyContact?.relationship ||
                                                "Not provided"}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900">
                                            {intake.emergencyContact?.phone ||
                                                "Not provided"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Intake Information
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                No intake information has been provided yet.
                            </p>
                        </div>
                    )}


                    {/* Appointment History */}
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Appointment History
                        </h2>


                        {allAppointments.length === 0 ? (

                            <p className="text-sm text-gray-500">
                                No appointments found.
                            </p>

                        ) : (

                            <div className="space-y-3">

                                {allAppointments.map((appointment) => (

                                    <div
                                        key={appointment._id}
                                        className="flex flex-col gap-4 rounded-lg border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >

                                        <div>

                                            <p className="font-medium text-gray-900">
                                                {new Date(
                                                    appointment.startTime
                                                ).toLocaleString()}
                                            </p>

                                            <span
                                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getAppointmentStatusStyle(
                                                    appointment.status
                                                )}`}
                                            >
                                                {appointment.status}
                                            </span>

                                        </div>


                                        <div className="flex items-center gap-3">

                                            {(appointment.status === "completed" || appointment.status === "pending") &&
                                                !hasSession(appointment._id) && (

                                                    <button
                                                        onClick={() =>
                                                            setSelectedAppointment(
                                                                appointment
                                                            )
                                                        }
                                                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                                    >
                                                        Add Session Notes
                                                    </button>

                                                )}


                                            {hasSession(appointment._id) && (

                                                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
                                                    Session Recorded ✓
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* Add Session Form */}
                    {selectedAppointment && (

                        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                            <div className="mb-6">

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Add Session Notes
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {new Date(
                                        selectedAppointment.startTime
                                    ).toLocaleString()}
                                </p>

                            </div>


                            <form
                                onSubmit={handleCreateSession}
                                className="space-y-5"
                            >

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Session Notes *
                                    </label>

                                    <textarea
                                        name="notes"
                                        value={sessionData.notes}
                                        onChange={handleSessionChange}
                                        required
                                        rows="5"
                                        placeholder="Write notes about the session..."
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Progress
                                    </label>

                                    <textarea
                                        name="progress"
                                        value={sessionData.progress}
                                        onChange={handleSessionChange}
                                        rows="4"
                                        placeholder="Describe the client's progress..."
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Current Concerns
                                    </label>

                                    <textarea
                                        name="currentConcerns"
                                        value={sessionData.currentConcerns}
                                        onChange={handleSessionChange}
                                        rows="4"
                                        placeholder="Any current concerns or new issues..."
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                                    />

                                </div>


                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <button
                                        type="submit"
                                        className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:bg-gray-800"
                                    >
                                        Save Session Record
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedAppointment(null);

                                            setSessionData({
                                                notes: "",
                                                progress: "",
                                                currentConcerns: ""
                                            });
                                        }}
                                        className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* Therapy Session History */}
                    <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Therapy Session History
                        </h2>


                        {sessions.length === 0 ? (

                            <p className="text-sm text-gray-500">
                                No session records yet.
                            </p>

                        ) : (

                            <div className="space-y-4">

                                {sessions.map((session) => (

                                    <div
                                        key={session._id}
                                        className="rounded-lg border border-gray-100 p-5"
                                    >

                                        <h3 className="font-semibold text-gray-900">

                                            Session •{" "}

                                            {session.appointmentId
                                                ? new Date(
                                                    session.appointmentId.startTime
                                                ).toLocaleDateString()
                                                : "Unknown Date"}

                                        </h3>


                                        <div className="mt-5 space-y-4">

                                            <div>

                                                <p className="text-sm font-medium text-gray-500">
                                                    Notes
                                                </p>

                                                <p className="mt-1 leading-relaxed text-gray-800">
                                                    {session.notes}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-sm font-medium text-gray-500">
                                                    Progress
                                                </p>

                                                <p className="mt-1 leading-relaxed text-gray-800">
                                                    {session.progress ||
                                                        "Not provided"}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-sm font-medium text-gray-500">
                                                    Current Concerns
                                                </p>

                                                <p className="mt-1 leading-relaxed text-gray-800">
                                                    {session.currentConcerns ||
                                                        "None recorded"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>
    )
}