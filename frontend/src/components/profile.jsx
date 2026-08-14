import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { Link } from "react-router-dom"
export default function Profile() {
    const { userData } = useContext(AuthContext);
    return (
        <>
            <div className="profile">

                <div className="profilesetting">
                    <div className="heading">Profile settings</div>
                    <div className="slug"><button>
                        <Link to="#profile">View Public Profile</Link>
                    </button></div>
                </div>

                <div className="main-profile">
                    <div className="card">
                        <div className="therapist-image">
                            <img src="https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=" alt="image" className="w-10 h-10" />
                        </div>

                        <div className="status">
                            <button>Active</button>
                        </div>
                    </div>
                    <div className="info">
                        <div className="tabs">
                            <ul>
                                <li><Link to="#basicInfo">Basic Info</Link></li>
                                <li><Link to="#practice">Practice</Link></li>
                                <li><Link to="#url">Security</Link></li>
                            </ul>
                        </div>

                        <div className="actions">
                            <form action="POST">
                                <div id="basicInfo">

                                <div className="name">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" name="name" id="name" value={userData.name}/>
                                </div>
                                <div className="bio">
                                    
                                <label htmlFor="bio">Biography:</label>
                                <textarea id="bio" name="bio" value={userData.bio}></textarea>
                                </div>

                                <div className="languages">
                                    <label htmlFor="languages">Languages</label>
                                    <input type="text" name="languages" id="languages" value={userData.languages} />
                                </div>
                                </div>

                                <div id="practice">
                                    <div className="specialization">
                                    <label htmlFor="specialization">Specializations </label>
                                    <input type="text" name="specialization" id="specialization" value={userData.specialization}/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}