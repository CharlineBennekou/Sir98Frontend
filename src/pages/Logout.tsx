import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

export default function Logout() {
    localStorage.removeItem("JWToken")
    localStorage.removeItem("Role")
    localStorage.removeItem("Email")
    toast.success(`Logget ud`, {
        iconTheme: {
            primary: "#ff0000",     // orange circle
            secondary: "#fff",      // white background
            
        },
        duration: 5000,
    });
    return (<Navigate to="/"/>);
}