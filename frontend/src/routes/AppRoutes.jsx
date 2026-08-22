import { Route, Routes } from "react-router-dom";
import Login from "../views/auth/login";
import Register from "../views/auth/register";
import Dashboard from "../views/therapist/dashboard";
import ClientPortal from "../views/client/clientPortal";
import Home from "../views/home";
import Schedule from "../views/therapist/schedule";
export default function AppRoutes(){
    return (
        <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/therapist/dashboard" element = {<Dashboard/>}/>
        <Route path="/:slug" element={<ClientPortal/>}/>
        <Route path="/therapist/schedule" element = {<Schedule/>}/>
        </Routes>
    )
}