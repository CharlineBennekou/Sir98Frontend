import { Navigate } from "react-router-dom";

export default function Logout() {
    localStorage.removeItem("JWToken")
    return (<Navigate to="/"/>);
}