import { Link } from "react-router-dom";

export function Signup() {
    
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
                <input type="text" placeholder="Harry" className="border rounded w-full" style={{padding: "2%"}} ></input>
                </div>

                <div  >
                <h3 className="font-medium" >Last Name</h3>
                <input type="text" placeholder="Potter"className="border rounded w-full" style={{padding: "2%"}} ></input>
                </div>

                <div >
                <h3 className="font-medium" >Email</h3>
                <input type="text" placeholder="harrypotter@gmail.com" className="border rounded w-full" style={{padding: "2%"}} ></input>
                </div>

                <div > 
                <h3 className="font-medium">Password</h3>
                <input type="text"placeholder="lovehermione" className="border rounded w-full" style={{padding: "2%"}}></input>
                </div>
             
            </div>

            <div className="flex flex-col items-center gap-3 w-full" style={{marginTop: "5%"}} >
            <button className="rounded-md bg-black text-white w-[90%] " style={{padding: "5px"}} 
            onClick={() => {

            }} >Sign Up</button>
            <p className="font-medium" >Already have an account? <Link to={"/signin"} className="underline" >Login</Link> </p>
            </div>

        </div>
                   
        </div>
    )
}