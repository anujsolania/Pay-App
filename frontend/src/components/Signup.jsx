
export function Signup() {
    
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-500" >
        <div className="border h-[60%] w-[30%] flex flex-col items-center gap-6 rounded-lg " >

            <div className="flex flex-col items-center gap-1" style={{marginTop: "7%"}} >
            <h1 className="text-2xl font-bold " >Sign Up</h1>
            <p className="text-center w-[90%]" >Enter your information to create an account</p>
            </div>

            <div className="flex flex-col items-center gap-5 w-[90%]" >
                <div className="w-full" >
                <h3>First Name</h3>
                <input type="text" placeholder="Harry" className="border w-full"></input>
                </div>

                <div className="w-full" >
                <h3>Last Name</h3>
                <input type="text" placeholder="Potter"className="border w-full" ></input>
                </div>

                <div className="w-full" >
                <h3>Email</h3>
                <input type="text" placeholder="harrypotter@gmail.com" className="border w-full" ></input>
                </div>

                <div className="w-full" > 
                <h3>Password</h3>
                <input type="text"placeholder="lovehermione" className="border w-full" ></input>
                </div>
             
            </div>

            <div className="flex flex-col items-center gap-3" >
            <button className="rounded-md bg-black text-white w-[100%] " style={{padding: "5px"}}  >Sign Up</button>
            <p>Already have an account?<a href="/signin">Login</a></p>
            </div>

        </div>
                   
        </div>
    )
}