import { Route, Routes } from "react-router-dom";
import Login from "../views/auth/login";
import Register from "../views/auth/register";
import Dashboard from "../views/therapist/dashboard";
import ClientPortal from "../views/client/clientPortal";
export default function AppRoutes(){
    return (
        <Routes>
        {/* <Route path="/" element = {<Home/>}/> */}
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/therapist/dashboard" element = {<Dashboard/>}/>
        <Route path="/:slug" element={<ClientPortal/>}/>
        </Routes>
    )
}