import logo from "../../assets/react.svg"
import PassVisible from '../../components/passVisible'
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import Popup from '../../components/popup';

const backendAPI = import.meta.env.VITE_BACKEND_API;
export default function Login() {
    const [isPassVisible, setPassVisible] = useState(false);
    const [OpenPop, setOpenPop] = useState(false);
    const [resMessage,setMessage] = useState("")
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    async function handleLogin(e) {

        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const mail = formData.get("email");
        const pword = formData.get("pass");

        const data = {
            email: mail,
            password: pword
        }

        const res = await fetch(`${backendAPI}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"

        });

        const rData = await res.json();
        if (res.ok) {
            login(rData.token);  
            navigate("/")
        }
        else {

            setMessage(rData.message)
            
            setOpenPop(true);
        }
    }

    return (
        <div className="wrapper h-screen flex items-center justify-center bg-gray-200">

            <form onSubmit={handleLogin} className='flex flex-col min-w-60 sm:min-w-90 max-w-100 sm:max-w-125 rounded-sm gap-2 items-center bg-white' >
                <div className="title flex justify-center">
                    <img src={logo} alt="logo" className='h-20 m-6 mb-4' />
                </div>
                <div className="EmailId flex flex-col mx-4 my-1 w-[90%]">
                    <input type="text" name="email" id="email" className='border-2 p-2 rounded-sm border-gray-400' placeholder='E-mail or Username' />
                </div>
                <div className="password flex flex-col mx-4 my-1 w-[90%] relative">
                    <input type={isPassVisible ? "text" : "password"} name="pass" id="pass" className='border-2 p-2 rounded-sm border-gray-400' placeholder='Password' />
                    <span className='absolute right-3 top-[25%]'>
                        <PassVisible isPassVisible={isPassVisible} setPassVisible={setPassVisible} />
                    </span></div>
                    <p>Not registered? <Link to="/register" className='text-blue-800'>SignUp</Link> here</p>
                <button type="submit" className="subBut  text-2xl w-[90%]  my-2 rounded-sm p-1 mb-4 bg-emerald-600 text-white">Login</button>
            </form>
            <Popup
                Open={OpenPop}
                onClose={() => { setOpenPop(false);}}
            >
                <h1>{resMessage}</h1>
            </Popup>
        </div>
    )
}