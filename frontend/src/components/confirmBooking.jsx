import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useToast } from "../context/toastContext";
export default function BookingConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {showToast} = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    if (!state?.slug || !state?.slot) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">
                        Invalid booking session
                    </h2>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 rounded-md bg-black px-5 py-2 text-white"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { slug, date, slot } = state;

    const startTime = slot[0];
    const endTime = slot[1];

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleFinalBooking = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post("/appointments/book", {
                slug,
                startTime,
                endTime,
                clientName: name,
                clientEmail: email,
                clientPhone: phone,
            });
            showToast(response.data.message);
           

            // navigate("/booking/success", {
            //     state: {
            //         appointment: response.data.appointment,
            //     },
            // });

        } catch (err) {
            showToast(err.response.data.message||"Could not complete the booking.");
            setError(
                err.response?.data?.message ||
                "Could not complete the booking."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">

            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-sm">

                <h1 className="mb-2 text-2xl font-semibold">
                    Confirm Appointment
                </h1>

                <p className="mb-8 text-sm text-gray-500">
                    Please verify your appointment details and enter
                    your contact information.
                </p>

                {/* Appointment Details */}
                <div className="mb-8 rounded-lg bg-gray-100 p-5">

                    <h2 className="mb-4 font-medium">
                        Appointment Details
                    </h2>

                    <div className="space-y-2 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Date
                            </span>

                            <span className="font-medium">
                                {formatDate(startTime)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Time
                            </span>

                            <span className="font-medium">
                                {formatTime(startTime)} -{" "}
                                {formatTime(endTime)}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Client Details */}
                <form
                    onSubmit={handleFinalBooking}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {loading
                            ? "Processing..."
                            : "Confirm Appointment"}
                    </button>

                </form>
            </div>
        </div>
    );
}