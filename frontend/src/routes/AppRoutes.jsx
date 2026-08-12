import { Route, Routes } from "react-router-dom";
import Login from "../views/auth/login";
import Register from "../views/auth/register";
export default function AppRoutes(){
    return (
        <Routes>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        </Routes>
    )
}