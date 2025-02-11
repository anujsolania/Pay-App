import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export function Signup() {
    const [firstname,setfirstname] = useState()
    const[lastname,setlastname] = useState()
    const[email,setemail] = useState()
    const[password,setpassword] = useState()

    
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen" >
        <div className="border h-auto w-auto flex flex-col items-center gap-6 rounded-lg " style={{padding: "2% 0"}} >

            <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold " >Sign Up</h1>
            <p className="text-center w-[90%]" >Enter your information to create an account</p>
            </div>

            <div className="flex flex-col gap-5 w-[90%]" >
                <div  >
                <h3 className="font-medium" >First Name</h3>
                <input type="text" placeholder="Harry" className="border rounded w-full" style={{padding: "2%"}} 
                value={firstname} onChange={(e) => { setfirstname(e.target.value) }}></input>
                </div>

                <div  >
                <h3 className="font-medium" >Last Name</h3>
                <input type="text" placeholder="Potter"className="border rounded w-full" style={{padding: "2%"}} 
                value={lastname} onChange={(e) => { setlastname(e.target.value) }}></input>
                </div>

                <div >
                <h3 className="font-medium" >Email</h3>
                <input type="text" placeholder="harrypotter@gmail.com" className="border rounded w-full" style={{padding: "2%"}}
                value={email} onChange={(e) => { setemail(e.target.value) }} ></input>
                </div>

                <div > 
                <h3 className="font-medium">Password</h3>
                <input type="text"placeholder="lovehermione" className="border rounded w-full" style={{padding: "2%"}}
                value={password} onChange={(e) => { setpassword(e.target.value) }}></input>
                </div>
             
            </div>

            <div className="flex flex-col items-center gap-3 w-full" style={{marginTop: "5%"}} >
            <button className="rounded-md bg-black text-white w-[90%] " style={{padding: "5px"}} 
            onClick={async () => {
                const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                    firstname,lastname,email,password
                })
                if (response.data) {
                    alert(response.data.mssg)
                    localStorage.setItem("token",response.data.token)
                }
            }} >Sign Up</button>
            <p className="font-medium" >Already have an account? <Link to={"/signin"} className="underline" >Login</Link> </p>
            </div>

        </div>
                   
        </div>
    )
}