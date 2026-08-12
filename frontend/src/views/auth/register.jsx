'use client'
import logo from "../../assets/react.svg"
import { useState } from 'react'
import PassVisible from '../../components/passVisible'
import {useNavigate } from 'react-router-dom'

const backendAPI = import.meta.env.VITE_BACKEND_API;
export default function Register() {
    const navigate = useNavigate();


    const [pass, setPass] = useState("");
    const [confirm_pass, setConfirmPass] = useState("");

    const matchPassword = (e) => {
        const curVal = e.target.value
        setConfirmPass(curVal)

        if (pass !== curVal) {
            e.target.setCustomValidity("Passwords do not match");
        }
        else {
            e.target.setCustomValidity("")
        }
    }

    const [isPassVisible, setPassVisible] = useState(false);
    const [isConfirmPassVisible, setConfirmPassVisible] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const uname = formData.get("username");
        const mail = formData.get("email");
        const pword = formData.get("pass");
        const confirm = formData.get("confirm_pass");

        if (pass !== confirm) {
            alert("Passwords do not match!");
            return;
        }
        const data = {
            name: uname,
            email: mail,
            password: pword
        }

        const res = await fetch(`${backendAPI}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"

        });

        if (res.ok){
            
            alert("Registered");
            navigate("/login");
        } 
        else alert("EROOORO");

    }

    return (
        <div className="wrapper h-screen flex items-center justify-center bg-gray-200">

            <form onSubmit={handleRegister} className='flex flex-col min-w-60 sm:min-w-90 max-w-100 sm:max-w-125 rounded-sm gap-2 items-center bg-white' >
                <div className="title flex justify-center">
                    <img src={logo} alt="logo" className='h-20 m-6 mb-4' />
                </div>

                <div className="user flex flex-col mx-4 my-1 w-[90%]">
                    <input type="text" name="username" id="username" className='border-2 p-2 rounded-sm border-gray-400' placeholder='Username' />
                </div>
                <div className="EmailId flex flex-col mx-4 my-1 w-[90%]">
                    <input type="email" name="email" id="email" className='border-2 p-2 rounded-sm border-gray-400' placeholder='E-mail' />
                </div>
                <div className="password flex flex-col mx-4 my-1 w-[90%] relative">
                    <input type={isPassVisible ? "text" : "password"} name="pass" id="pass" className='border-2 p-2 rounded-sm border-gray-400' placeholder='Password' required onChange={(e) => { setPass(e.target.value) }} />
                    <span className='absolute right-3 top-[25%]'>
                        <PassVisible isPassVisible={isPassVisible} setPassVisible={setPassVisible} />
                    </span>
                </div>
                <div className="confirmPass flex flex-col mx-4 my-1 w-[90%] relative">
                    <input type={isConfirmPassVisible ? "text" : "password"} name="confirm_pass" id="confirm_pass" className='border-2 p-2 rounded-sm border-gray-400' placeholder='Confirm password' required onChange={matchPassword} />
                    <span className='absolute right-3 top-[25%]'>
                        <PassVisible isPassVisible={isConfirmPassVisible} setPassVisible={setConfirmPassVisible} />
                    </span>
                </div>
                <button type="submit" className="subBut  text-2xl w-[90%]  my-2 rounded-sm p-1 mb-4 bg-emerald-600 text-white">Sign up</button>
            </form>
        </div>
    )
}