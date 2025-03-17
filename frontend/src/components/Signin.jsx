import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "./contextAPI/Context";
import { toast } from "react-toastify";

export function Signin() {
    const {fetchData} = useContext(MyContext)
    const {fetchUsers} = useContext(MyContext)

        const[email,setemail] = useState("")
        const[password,setpassword] = useState("")

        const navigate = useNavigate()

        async function loginHandler() {

            try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/signin`,{
                email,
                password
            })
            const token = response.data.token

            if (token) {
                localStorage.setItem("token",response.data.token)
                toast.success(response.data.mssg);
                await fetchData()
                await fetchUsers()
                navigate("/dashboard");
            } else {
                toast(response.data.mssg)
            }
        } catch(error) {
                toast.error(error.response.data.error || error.response.data.message);
            }
            
        }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen" >
            <div className="h-auto w-auto flex flex-col items-center gap-6 border rounded-lg py-[2%]">
                
                <div className="flex flex-col items-center gap-1" >
                    <h1 className="text-2xl font-bold " >Sign In</h1>
                    <p className="text-center w-[90%]" >Enter your credentials to access your account</p>
                </div>

                <div className="flex flex-col gap-5 w-[90%]" >
                <div >
                    <h1 className="font-medium" >Email</h1>
                    <input type="text" placeholder="harrypotter@gmail.com" className="border rounded w-full p-[2%]"
                    value={email} onChange={(e) => {setemail(e.target.value)}} ></input>
                </div>
                
                <div>
                    <h1 className="font-medium">Password</h1>
                    <input type="password" className="border rounded w-full p-[2%]" style={{padding: "2%"}} 
                    value={password} onChange={(e) => {setpassword(e.target.value)}} ></input>
                </div>
                </div>
 

                <div className="flex flex-col items-center gap-3 w-full font-medium mt-[5%]">
                <button className="rounded-md bg-black text-white w-[90%] p-[5px]"
                onClick={() => {
                    try {
                        loginHandler()

                    } catch (error) {
                        toast.error(error.response.data.error)
                    }
                }} >Sign In</button>
                <p className="font-medium" >Don't have an account? <Link to={"/"} className="underline">Sign Up</Link> </p>
                </div>

            </div>
        </div>
    )
}