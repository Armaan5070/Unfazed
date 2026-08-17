
export default function ClientNavbar(){
    return (
        <>
        <nav className="flex items-center justify-between px-8 py-5">
            <div className="logo">UNFAZED</div>
            <div className="options">
                <ul className="flex justify-between gap-5">
                    <li>Dashboard</li>
                    <li>Clients</li>
                    <li>Schedule</li>
                    <li>Pricing</li>
                    <li>Service Card</li>
                </ul>
            </div>

        </nav>
        </>
    )
}