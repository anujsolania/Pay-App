import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Signin() {
        const[email,setemail] = useState("")
        const[password,setpassword] = useState("")

        const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen" >
            <div className="h-auto w-auto flex flex-col items-center gap-6 border rounded-lg" style={{padding: "2% 0"}} >
                
                <div className="flex flex-col items-center gap-1" >
                    <h1 className="text-2xl font-bold " >Sign In</h1>
                    <p className="text-center w-[90%]" >Enter your credentials to access your account</p>
                </div>

                <div className="flex flex-col gap-5 w-[90%]" >
                <div >
                    <h1 className="font-medium" >Email</h1>
                    <input type="text" placeholder="harrypotter@gmail.com" className="border rounded w-full" style={{padding: "2%"}}
                    value={email} onChange={(e) => {setemail(e.target.value)}} ></input>
                </div>
                
                <div>
                    <h1 className="font-medium">Password</h1>
                    <input type="text" className="border rounded w-full" style={{padding: "2%"}} 
                    value={password} onChange={(e) => {setpassword(e.target.value)}} ></input>
                </div>
                </div>
 

                <div className="flex flex-col items-center gap-3 w-full font-medium" style={{marginTop: "5%"}} >
                <button className="rounded-md bg-black text-white w-[90%] " style={{padding: "5px"}} 
                onClick={async () => {
                    try {
                        const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                            email,
                            password
                        })
                        alert(response.data.mssg)
                        localStorage.setItem("token",response.data.token)
                        navigate("/dashboard")
                    } catch (error) {
                        alert(error.response.data.error)
                    }
                }} >Sign In</button>
                <p className="font-medium" >Don't have an account? <Link to={"/signup"} className="underline">Sign Up</Link> </p>
                </div>

            </div>
        </div>
    )
}