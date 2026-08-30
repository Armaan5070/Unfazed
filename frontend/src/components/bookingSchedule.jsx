import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

export default function BookingSchedule() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            return;
        }

        const fetchAvailableSchedule = async () => {
            try {
                setLoading(true);
                setError("");
                setSelectedSlot(null);

                const response = await api.get(
                    `${slug}/available?date=${selectedDate}`
                );

                setAvailableSlots(response.data);
            } catch (err) {
                setError("Could not fetch available slots.");
                setAvailableSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableSchedule();
    }, [selectedDate, slug]);

    const formatTime = (utcDate) => {
        return new Date(utcDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleBooking = () => {
        if (!selectedSlot) return;

        navigate("/booking/confirmation", {
            state: {
                slug,
                date: selectedDate,
                slot: selectedSlot,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
            <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow-sm">

                <h1 className="mb-8 text-2xl font-semibold">
                    Book an Appointment
                </h1>

                {/* Date */}
                <div className="mb-8">
                    <label
                        htmlFor="bookingDate"
                        className="mb-2 block text-sm font-medium"
                    >
                        Pick a date
                    </label>

                    <input
                        type="date"
                        id="bookingDate"
                        value={selectedDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                </div>

                {/* Slots */}
                {selectedDate && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-lg font-medium">
                            Available Slots
                        </h2>

                        {loading && (
                            <p className="text-sm text-gray-500">
                                Loading available slots...
                            </p>
                        )}

                        {error && (
                            <p className="text-sm text-gray-600">
                                {error}
                            </p>
                        )}

                        {!loading &&
                            !error &&
                            availableSlots.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    No slots available for this date.
                                </p>
                            )}

                        <div className="flex flex-wrap gap-3">
                            {availableSlots.map((slot, index) => {
                                const isSelected =
                                    selectedSlot === slot;

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                            setSelectedSlot(slot)
                                        }
                                        className={`rounded-md border px-4 py-2 text-sm transition ${
                                            isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 bg-white text-gray-900 hover:border-black"
                                        }`}
                                    >
                                        {formatTime(slot[0])}
                                        {" - "}
                                        {formatTime(slot[1])}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Book */}
                <button
                    type="button"
                    disabled={!selectedSlot}
                    onClick={handleBooking}
                    className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    Continue to Confirmation
                </button>

            </div>
        </div>
    );
}