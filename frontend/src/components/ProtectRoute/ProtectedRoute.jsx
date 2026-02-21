import { jwtDecode } from "jwt-decode"
import { Navigate, Outlet } from "react-router-dom"
import { toast } from "react-toastify"


export const ProtectedRoute = () => {
    const token = localStorage.getItem("token") 

    let decodedToken = null

    token ? decodedToken = jwtDecode(token) : null

    const currentTime = Date.now() / 1000; // Convert to seconds

    if (!decodedToken || (decodedToken && decodedToken.exp < currentTime)) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        return <Navigate to="/signin" replace />;
    } else {
        return <Outlet/> 
    } 
}

