import api from "../../api/axiosInstance";
import ClientNavbar from "../../components/clientNavbar";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

const therapist = {
    name: "Dr. Sarah Johnson",
    title: "Licensed Therapist",
    image:
        "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=",
    location: "Ahmedabad",
    rating: 4.9,
    reviews: 128,
    languages: ["English", "Hindi", "Gujarati"],
    bio: `I am a licensed therapist dedicated to helping individuals and couples navigate life's challenges with greater clarity and confidence. My approach is warm, collaborative, and tailored to each person's unique needs.`,
    specializations: [
        "Anxiety",
        "Depression",
        "Trauma",
        "Relationships",
        "Stress Management",
    ],
    sessions: [
        {
            name: "Individual Therapy",
            duration: "50 min",
            price: "₹1,500",
        },
        {
            name: "Couples Therapy",
            duration: "60 min",
            price: "₹2,000",
        },
        {
            name: "Initial Consultation",
            duration: "30 min",
            price: "₹800",
        },
    ],
};

const availability = [
    {
        date: "18",
        day: "Tue",
        slots: ["9:00 AM", "11:30 AM", "3:00 PM"],
    },
    {
        date: "19",
        day: "Wed",
        slots: ["10:00 AM", "2:00 PM", "5:30 PM"],
    },
    {
        date: "20",
        day: "Thu",
        slots: ["11:00 AM", "3:00 PM", "6:00 PM"],
    },
    {
        date: "21",
        day: "Fri",
        slots: ["9:30 AM", "2:00 PM", "4:30 PM"],
    },
    {
        date: "22",
        day: "Sat",
        slots: ["10:00 AM", "12:30 PM"],
    },
];

export default function ClientPortal() {
    const {slug} = useParams();
    // console.log("hi",slug);
    const [physio, setPhysio] = useState(null);
    const [selectedSession, setSelectedSession] = useState(
        therapist.sessions[0]
    );
    const [selectedDate, setSelectedDate] = useState(availability[0]);
    const [selectedTime, setSelectedTime] = useState(null);
    useEffect(()=>{
        // console.log(slug);

        async function fetchProfile(){

            try {
                const response = await api.get(`${slug}`);
                const fetchedData = response.data;
                // console.log(fetchedData);
                setPhysio(fetchedData.data);
                // console.log(physio);
                
            } catch (error) {
                console.log(error);
            }
        }
        fetchProfile();
    },[slug])

    

    const handleBooking = () => {
        if (!selectedTime) {
            alert("Please select an available time.");
            return;
        }

        alert(
            `Booking ${selectedSession.name} with ${therapist.name} on ${selectedDate.day} ${selectedDate.date} at ${selectedTime}`
        );
    };

    if (!physio) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-gray-500">
                Loading therapist profile...
            </p>
        </div>
    );
}

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto w-full max-w-6xl">

                {/* Main Profile Header */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                        <div className="flex flex-col items-center gap-5 sm:flex-row">
                            {/* Profile Image */}
                            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-sm">
                                <img
                                    src={therapist.image}
                                    // alt={physio.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Therapist Details */}
                            <div className="text-center sm:text-left">
                                <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {physio.name}
                                    </h1>

                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                        Available
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500">
                                    {therapist.title}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 sm:justify-start">
                                    <span className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <strong className="text-gray-900">
                                            {therapist.rating}
                                        </strong>
                                        <span>
                                            ({therapist.reviews} reviews)
                                        </span>
                                    </span>

                                    <span className="text-gray-300">•</span>

                                    <span>{therapist.location}</span>

                                    <span className="text-gray-300">•</span>

                                    <span>Online</span>
                                </div>

                                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    {physio.languages.map((language) => (
                                        <span
                                            key={language}
                                            className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                                        >
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Header CTA */}
                        <div className="flex flex-col items-stretch gap-2 sm:flex-row md:flex-col">
                            <button
                                type="button"
                                onClick={handleBooking}
                                className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Book Now
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Choose a session and available time
                            </p>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                        About
                    </h2>

                    <p className="max-w-4xl text-sm leading-7 text-gray-600">
                        {physio.bio}
                    </p>
                </div>

                {/* Specializations */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium text-gray-900">
                        Specializations
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {physio.specializations.map((specialization) => (
                            <span
                                key={specialization}
                                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700"
                            >
                                {specialization}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sessions & Pricing */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-medium text-gray-900">
                            Sessions & Pricing
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose the session that works best for you.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {therapist.sessions.map((session) => {
                            const isSelected =
                                selectedSession.name === session.name;

                            return (
                                <button
                                    key={session.name}
                                    type="button"
                                    onClick={() =>
                                        setSelectedSession(session)
                                    }
                                    className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                                        isSelected
                                            ? "border-gray-900 bg-gray-50"
                                            : "border-gray-200 hover:border-gray-400"
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {session.name}
                                            </h3>

                                            {isSelected && (
                                                <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium text-white">
                                                    Selected
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {session.duration}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {session.price}
                                        </span>

                                        <span
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                isSelected
                                                    ? "border-gray-900 bg-gray-900"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            {isSelected && (
                                                <span className="h-2 w-2 rounded-full bg-white" />
                                            )}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Availability */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                        <h2 className="text-lg font-medium text-gray-900">
                            Availability
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Select a date and an available time for your
                            session.
                        </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {availability.map((item) => {
                            const isSelected =
                                selectedDate.date === item.date;

                            return (
                                <button
                                    key={item.date}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDate(item);
                                        setSelectedTime(null);
                                    }}
                                    className={`rounded-lg border p-3 transition ${
                                        isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 bg-white hover:border-gray-400"
                                    }`}
                                >
                                    <p
                                        className={`text-xs ${
                                            isSelected
                                                ? "text-gray-300"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {item.day}
                                    </p>

                                    <p className="mt-1 text-lg font-semibold">
                                        {item.date}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected Date */}
                    <div className="mt-6 border-t border-gray-200 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                                Available times
                            </h3>

                            <span className="text-xs text-gray-500">
                                {selectedDate.day} {selectedDate.date}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {selectedDate.slots.map((time) => {
                                const isSelected = selectedTime === time;

                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`rounded-md border px-4 py-3 text-sm transition ${
                                            isSelected
                                                ? "border-gray-900 bg-gray-900 font-medium text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                                        }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="sticky bottom-4 mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-gray-500">
                                Your selection
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-medium text-gray-900">
                                    {selectedSession.name}
                                </span>

                                <span className="text-gray-300">•</span>

                                <span className="text-gray-600">
                                    {selectedSession.duration}
                                </span>

                                <span className="text-gray-300">•</span>

                                <span className="font-medium text-gray-900">
                                    {selectedSession.price}
                                </span>

                                {selectedTime && (
                                    <>
                                        <span className="text-gray-300">•</span>

                                        <span className="text-gray-600">
                                            {selectedDate.day}{" "}
                                            {selectedDate.date} at{" "}
                                            {selectedTime}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleBooking}
                            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}