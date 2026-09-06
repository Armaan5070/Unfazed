import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useToast } from "../context/toastContext";

export default function BookingConfirmation() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [clientExists, setClientExists] = useState(null);
    const [checkingClient, setCheckingClient] = useState(false);
    const [bookingFor, setBookingFor] = useState("myself");

    const [bookerData, setBookerData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [clientData, setClientData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        presentingConcern: "",
        goalsForTherapy: "",
        previousTherapy: "",
        relevantHistory: "",

        emergencyContact: {
            name: "",
            relationship: "",
            phone: ""
        },

        consentAccepted: false
    });

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

    const { slug, slot } = state;

    const startTime = slot[0];
    const endTime = slot[1];

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    const checkExistingClient = async () => {
        const email = clientData.email.trim();

        if (!email) return;

        try {
            setCheckingClient(true);

            const response = await api.get(
                `/appointments/check-client?slug=${slug}&email=${encodeURIComponent(email)}`
            );

            setClientExists(response.data.exists);

        } catch (error) {
            console.error("Error checking client:", error);
            setClientExists(null);

        } finally {
            setCheckingClient(false);
        }
    };
    // Universal handleChange
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const finalValue = type === "checkbox" ? checked : value;

        const parts = name.split(".");

        // BOOKER
        if (parts[0] === "booker") {
            setBookerData((prev) => ({
                ...prev,
                [parts[1]]: finalValue
            }));

            return;
        }

        // CLIENT
        if (parts[0] === "client") {

            // Normal client fields
            if (parts.length === 2) {
                setClientData((prev) => ({
                    ...prev,
                    [parts[1]]: finalValue
                }));
            }

            // Nested emergency contact fields
            if (
                parts.length === 3 &&
                parts[1] === "emergencyContact"
            ) {
                setClientData((prev) => ({
                    ...prev,
                    emergencyContact: {
                        ...prev.emergencyContact,
                        [parts[2]]: finalValue
                    }
                }));
            }
        }
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
            bookingFor,
            clientData,
            bookerData
        });

        showToast(response.data.message);

        // navigate("/booking/success", {
        //     state: {
        //         appointment: response.data.appointment
        //     }
        // });

    } catch (err) {

        const message =
            err.response?.data?.message ||
            "Could not complete the booking.";

        showToast(message, "error");
        setError(message);

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
                    Please complete your details before confirming
                    your appointment.
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

                <form
                    onSubmit={handleFinalBooking}
                    className="space-y-5"
                >
                    <div className="space-y-3">
                        <label className="block text-sm font-medium">
                            Who is this appointment for?
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="bookingFor"
                                value="myself"
                                checked={bookingFor === "myself"}
                                onChange={(e) => setBookingFor(e.target.value)}
                            />

                            Myself
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="bookingFor"
                                value="someoneElse"
                                checked={bookingFor === "someoneElse"}
                                onChange={(e) => setBookingFor(e.target.value)}
                            />

                            Someone else
                        </label>
                    </div>
                    {/* Basic Details */}
                    {bookingFor === "someoneElse" && (
                        <div className="space-y-5 rounded-lg border p-5">

                            <h2 className="text-lg font-semibold">
                                Your Details
                            </h2>

                            <p className="text-sm text-gray-500">
                                Please enter the details of the person making this booking.
                            </p>

                            {/* Booker Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Your Name
                                </label>

                                <input
                                    type="text"
                                    name="booker.name"
                                    value={bookerData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                                />
                            </div>

                            {/* Booker Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Your Email
                                </label>

                                <input
                                    type="email"
                                    name="booker.email"
                                    value={bookerData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                                />
                            </div>

                            {/* Booker Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Your Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="booker.phone"
                                    value={bookerData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 outline-none focus:border-black"
                                />
                            </div>

                        </div>
                    )}
                    <h2 className="text-lg font-semibold">
                        {bookingFor === "myself"
                            ? "Your Details"
                            : "Client Details"}
                    </h2>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="client.name"
                            value={clientData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="client.email"
                            value={clientData.email}
                            onChange={handleChange}
                            onBlur={checkExistingClient}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                        />

                        {checkingClient && (
                            <p className="mt-1 text-sm text-gray-500">
                                Checking client...
                            </p>
                        )}

                        {clientExists === true && (
                            <p className="mt-1 text-sm text-green-600">
                                Returning client detected.
                            </p>
                        )}

                        {clientExists === false && (
                            <p className="mt-1 text-sm text-blue-600">
                                New client. Please complete the intake information below.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="client.phone"
                            value={clientData.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                        />
                    </div>

                    {clientExists === false && (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="client.dateOfBirth"
                                    value={clientData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Gender
                                </label>

                                <select
                                    name="client.gender"
                                    value={clientData.gender}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">
                                        Prefer not to say
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Address
                                </label>

                                <textarea
                                    name="client.address"
                                    value={clientData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>


                            {/* Therapy Information */}

                            <h2 className="pt-4 text-lg font-semibold">
                                Therapy Information
                            </h2>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    What brings you to therapy?
                                </label>

                                <textarea
                                    name="client.presentingConcern"
                                    value={clientData.presentingConcern}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    What are your goals for therapy?
                                </label>

                                <textarea
                                    name="client.goalsForTherapy"
                                    value={clientData.goalsForTherapy}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Have you attended therapy before?
                                </label>

                                <textarea
                                    name="client.previousTherapy"
                                    value={clientData.previousTherapy}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Relevant History
                                </label>

                                <textarea
                                    name="client.relevantHistory"
                                    value={clientData.relevantHistory}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                                />
                            </div>


                            {/* Emergency Contact */}

                            <h2 className="pt-4 text-lg font-semibold">
                                Emergency Contact
                            </h2>

                            <input
                                type="text"
                                name="client.emergencyContact.name"
                                placeholder="Name"
                                value={clientData.emergencyContact.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                            />

                            <input
                                type="text"
                                name="client.emergencyContact.relationship"
                                placeholder="Relationship"
                                value={clientData.emergencyContact.relationship}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                            />

                            <input
                                type="tel"
                                name="client.emergencyContact.phone"
                                placeholder="Phone Number"
                                value={clientData.emergencyContact.phone}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2.5"
                            />

                        </>
                    )}

                    {/* Consent */}

                    <div className="rounded-md border border-gray-300 p-4">

                        <label className="flex cursor-pointer items-start gap-3">

                            <input
                                type="checkbox"
                                name="client.consentAccepted"
                                checked={clientData.consentAccepted}
                                onChange={handleChange}
                                className="mt-1"
                                required={true}
                            />

                            <span className="text-sm text-gray-700">
                                I confirm that the information provided is
                                accurate and I agree to the terms and
                                consent to proceed with the appointment.
                            </span>

                        </label>

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
