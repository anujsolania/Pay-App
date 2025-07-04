import { Navigate, Outlet } from "react-router-dom"
import { toast } from "react-toastify"


export const ProtectedRoute = () => {
    const token = localStorage.getItem("token")

    return token ? <Outlet/> : <Navigate to={"/signin"} replace/>
}

