import axios from "axios"
import { useState } from "react"

export default function Updateinfo({showupdateinfo,setshowupdateinfo}) {
            const[newemail,setnewemail] = useState("")
            const[newpassword,setnewpassword] = useState("")
    return (
        <div className="h-screen w-screen fixed flex justify-center items-center backdrop-blur-xs transition-all duration-1000" style={{right: showupdateinfo ? "0px" : "-100vw"}} >
            <div className="h-80 w-60 sm:w-90 flex flex-col justify-center items-center border border-black rounded-lg p-6 bg-white/70" >

                <div className="w-full flex " >
                <i className="ri-arrow-right-line border rounded p-1.5" onClick={() => {setshowupdateinfo(false)}} ></i>
                </div>

                <div className="w-full flex flex-col justify-center items-center gap-8" >
                <h1 className="font-semibold text-2xl" >Update Info </h1>
                <input className="border w-full p-[2%] rounded" type="text" placeholder="Enter new email"
                value={newemail} onChange={(e) => {setnewemail(e.target.value)}} ></input>
                <input className="border w-full p-[2%] rounded" type="text" placeholder="Enter new password"
                value={newpassword} onChange={(e) => {setnewpassword(e.target.value)}} ></input>
                <button onClick={async ()=> { 
                    const token = localStorage.getItem("token")
                    const response = await axios.patch("http://localhost:3000/api/v1/user/updateinfo",{
                        newemail,
                        newpassword
                    },{
                        headers: {
                            Authorization: token
                        }
                    })
                    alert(response.data.mssg)
                    setshowupdateinfo(false)
                }} className="border bg-black text-white rounded border-black w-fit p-[2%]"  >Update</button>
                </div>
                
            </div>
        </div>
    )
}