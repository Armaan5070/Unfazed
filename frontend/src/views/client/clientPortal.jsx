import api from "../../api/axiosInstance";
import ClientNavbar from "../../components/clientNavbar";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function ClientPortal() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [physio, setPhysio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await api.get(`${slug}`);

                setPhysio(response.data.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Could not load therapist profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading therapist profile...
                </p>
            </div>
        );
    }

    if (error || !physio) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    {error || "Therapist not found."}
                </p>
            </div>
        );
    }

    return (
        <>
            <ClientNavbar />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Profile */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex flex-col items-center gap-5 sm:flex-row">

                                {/* Image */}
                                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                                    <img
                                        src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                                        alt={physio.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="text-center sm:text-left">

                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {physio.name}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                        {physio.languages?.map(
                                            (language) => (
                                                <span
                                                    key={language}
                                                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                                                >
                                                    {language}
                                                </span>
                                            )
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* Book */}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/${slug}/book`
                                    )
                                }
                                className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Book Appointment
                            </button>

                        </div>
                    </div>

                    {/* About */}
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-medium">
                            About
                        </h2>

                        <p className="max-w-4xl text-sm leading-7 text-gray-600">
                            {physio.bio}
                        </p>

                    </div>

                    {/* Specializations */}
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-medium">
                            Specializations
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {physio.specializations?.map(
                                (specialization) => (
                                    <span
                                        key={specialization}
                                        className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700"
                                    >
                                        {specialization}
                                    </span>
                                )
                            )}
                        </div>

                    </div>



                </div>
            </div>
        </>
    );
}