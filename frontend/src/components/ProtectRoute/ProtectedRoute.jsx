import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"


export const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("token")

    if (!token) {
        toast("Please login")
        return <Navigate to={"/signin"} replace />
    }

  return children
}

