import { useContext } from "react"
import { AuthContext } from "../context/authContext"
export default function Navbar(){
    const {userData} = useContext(AuthContext);
    return (
        <>
        <nav className="flex items-center justify-between px-8 py-5">
            <div className="logo">UNFAZED</div>
            <div className="options">
                <ul className="flex justify-between gap-5">
                    <li>Dashboard</li>
                    <li>Clients</li>
                    <li>Schedule</li>
                    <li>Notes</li>
                    <li>Analytics</li>
                </ul>
            </div>
            <div className="profile">
                {userData?<div className="flex justify-between gap-5">
                    <div>{userData.name}</div>
                    <div>Logout</div>
                    </div>:<div>Login</div>}
            </div>
        </nav>
        </>
    )
}