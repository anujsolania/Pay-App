import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MyContext } from "./contextAPI/Context";

export function Signup() {
    const [firstname,setfirstname] = useState("")
    const[lastname,setlastname] = useState("")
    const[email,setemail] = useState("")
    const[password,setpassword] = useState("")

    const { fetchData } = useContext(MyContext)
    const {fetchUsers} = useContext(MyContext)

    const navigate = useNavigate()

    
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen" >
        <div className="border h-auto w-[65%] sm:w-[40%] flex flex-col items-center gap-6 rounded-lg py-[2%]" >

            <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold " >Sign Up</h1>
            <p className="text-center w-[90%]" >Enter your information to create an account</p>
            </div>

            <div className="flex flex-col gap-5 w-[90%]" >
                <div  >
                <h3 className="font-medium" >First Name</h3>
                <input type="text" placeholder="Harry" className="border rounded w-full p-[2%]"
                value={firstname} onChange={(e) => { setfirstname(e.target.value) }}></input>
                </div>

                <div  >
                <h3 className="font-medium" >Last Name</h3>
                <input type="text" placeholder="Potter"className="border rounded w-full p-[2%]" 
                value={lastname} onChange={(e) => { setlastname(e.target.value) }}></input>
                </div>

                <div >
                <h3 className="font-medium" >Email</h3>
                <input type="text" placeholder="harrypotter@gmail.com" className="border rounded w-full p-[2%]"
                value={email} onChange={(e) => { setemail(e.target.value) }} ></input>
                </div>

                <div > 
                <h3 className="font-medium">Password</h3>
                <input type="text"placeholder="lovehermione" className="border rounded w-full p-[2%]"
                value={password} onChange={(e) => { setpassword(e.target.value) }}></input>
                </div>
             
            </div>

            <div className="flex flex-col items-center gap-3 w-full mt-[5%]" >
            <button className="rounded-md bg-black text-white w-[90%] p-[5px]" 
            onClick={async () => {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/signup`,{
                        firstname,
                        lastname,
                        email,
                        password
                    })
                    const token = response.data.token
                    if (token) {
                        localStorage.setItem("token",response.data.token)
                        await fetchData()
                        await fetchUsers()
                        navigate("/dashboard")
                        toast.success(response.data.mssg)
                    } else {
                        toast(response.data.mssg)
                    }
                } catch (error) {
                    toast.error(error.response.data.error)
                }
            }}>Sign Up</button>
            <p className="font-medium" >Already have an account? <Link to={"/signin"} className="underline" >Login</Link> </p>
            </div>

        </div>
                   
        </div>
    )
}