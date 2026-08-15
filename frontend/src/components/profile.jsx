import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { Link } from "react-router-dom"
import Switch from "./toggleSwitch";
import api from "../api/axiosInstance";
export default function Profile() {
    const { userData, setUserData } = useContext(AuthContext);

    const [message, SetMessage] = useState("");
    async function saveChanges(e) {
        try {
            e.preventDefault();
            const dataToSend = {
                ...userData,
                languages: userData.languages
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),

                specializations: userData.specializations
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            };

            const response = await api.put('/therapist/profile/me', dataToSend)
            SetMessage(response.data);
        } catch (err) {
            SetMessage(err);
        } finally {
             console.log(message);
        }
    }





    function handleChange(e) {
        const { name, value } = e.target;
        setUserData((d) => ({
            ...d,
            [name]: value
        }))
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto w-full max-w-6xl">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Profile settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your profile information and settings
                        </p>
                    </div>

                    <Link
                        to="#profile"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        View Public Profile
                    </Link>
                </div>

                {/* Main Card */}
                <div className="flex flex-col gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row">

                    {/* Profile Card */}
                    <div className="flex w-full flex-col items-center gap-5 rounded-lg border border-gray-200 bg-gray-50 p-6 md:w-56">

                        <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-sm">
                            <img
                                src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="text-center">
                            <h3 className="font-medium text-gray-900">
                                {userData.name || "Your Name"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Therapist
                            </p>
                        </div>

                        <div className="flex w-full items-center justify-between border-t border-gray-200 pt-4">
                            <label
                                htmlFor="activeStatus"
                                className="text-sm font-medium text-gray-700"
                            >
                                Status
                            </label>

                            <Switch />
                        </div>
                    </div>

                    {/* Information */}
                    <div className="flex-1">

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <ul className="flex gap-6">
                                <li>
                                    <a
                                        href="#basicInfo"
                                        className="inline-block pb-3 text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Basic Info
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#practice"
                                        className="inline-block pb-3 text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Practice
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#url"
                                        className="inline-block pb-3 text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Security
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <form action="POST" className="space-y-8">

                            {/* Basic Info */}
                            <div id="basicInfo">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Basic Information
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={userData.name}
                                            onChange={handleChange}
                                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="languages"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Languages
                                        </label>

                                        <input
                                            type="text"
                                            name="languages"
                                            id="languages"
                                            value={userData.languages}
                                            onChange={handleChange}
                                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label
                                            htmlFor="bio"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Biography
                                        </label>

                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows="4"
                                            value={userData.bio}
                                            onChange={handleChange}
                                            className="resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Practice */}
                            <div
                                id="practice"
                                className="border-t border-gray-200 pt-6"
                            >
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Practice
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="specialization"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Specializations
                                    </label>

                                    <input
                                        type="text"
                                        name="specializations"
                                        id="specialization"
                                        value={userData.specializations}
                                        onChange={handleChange}
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Security */}
                            <div
                                id="url"
                                className="border-t border-gray-200 pt-6"
                            >
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Security
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={userData.email}
                                            readOnly
                                            className="cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="slug"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Profile Slug
                                        </label>

                                        <input
                                            type="text"
                                            name="slug"
                                            id="slug"
                                            value={userData.slug}
                                            onChange={handleChange}
                                            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Save */}
                            <div className="flex justify-end border-t border-gray-200 pt-6">
                                <button
                                    type="submit"
                                    onClick={saveChanges}
                                    className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                >
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}