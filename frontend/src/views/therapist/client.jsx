import { useEffect, useState } from "react"
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { useToast } from "../../context/toastContext";
export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { showToast } = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        const getClients = async () => {
            try {

                const response = await api.get("therapist/clients", {
                    params: {
                        search,
                        status: statusFilter
                    }
                });
                const data = response.data;
                setClients(data);

            } catch (error) {
                setError(error?.response?.data?.message);
                showToast(error?.response?.data?.message || ("something went wrong", "error"))
            } finally {
                setLoading(false);
            }
        }
        getClients()
    }, [search, statusFilter])

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
    if (loading) {
        return (
            <>
                <h1>

                    Loading clients......
                </h1>
            </>
        )
    }
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">

                <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">

                    <div className="rounded-xl bg-white p-8 text-center shadow-sm">

                        <h2 className="text-xl font-semibold text-gray-900">
                            Unable to Load Clients
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {error}
                        </p>

                    </div>

                </div>

            </div>
        );
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-6">

                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Clients
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage and view your clients
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row">

                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-black"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none"
                        >
                            <option value="all">All Clients</option>
                            <option value="new">New</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                    </div>

                    {/* Client List */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        {clients.length === 0 ? (
                            <div className="p-10 text-center">

                                <h3 className="font-semibold text-gray-900">
                                    {search || statusFilter !== "all"
                                        ? "No matching clients found"
                                        : "No clients yet"}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    {search || statusFilter !== "all"
                                        ? "Try changing your search or filter."
                                        : "Clients will appear here after appointments are booked."}
                                </p>

                            </div>
                        ) : (

                            clients.map((client) => (

                                <div
                                    key={client._id}
                                    onClick={() => {
                                        navigate(`/therapist/clients/${client._id}`);
                                    }}
                                    className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-5 transition hover:bg-gray-50"
                                >

                                    {/* Client Info */}
                                    <div className="flex items-center gap-4">

                                        {/* Avatar */}
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
                                            {client.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {client.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {client.email}
                                            </p>

                                            {client.phone && (
                                                <p className="text-sm text-gray-400">
                                                    {client.phone}
                                                </p>
                                            )}
                                        </div>

                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-4">

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${getClientStatusStyle(
                                                client.status
                                            )}`}
                                        >
                                            {client.status}
                                        </span>

                                        <span className="text-xl text-gray-400">
                                            →
                                        </span>

                                    </div>

                                </div>

                            ))
                        )}

                    </div>

                </div>

            </div>
        </>
    )
}