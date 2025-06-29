import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Updateinfo from "./Updateinfo";
import { MyContext } from "../contextAPI/Context";
import { toast } from "react-toastify";

export default function Navabar({setshownav,style,name}) {

    const [showupdateinfo,setshowupdateinfo] = useState(false)


    return (
        <div>
        <Updateinfo showupdateinfo={showupdateinfo} setshowupdateinfo={setshowupdateinfo} style={{right: showupdateinfo ? "0" : "-100vw"}}></Updateinfo>
        <div className="border h-screen sm:w-fit border-l-gray-500 flex flex-col fixed top-0 p-7 backdrop-blur-xs bg-white/75 transition-all duration-1000" style={style}  >
            <h1>
            <i className="ri-arrow-right-line border rounded p-1.5" onClick={() => {setshownav(false)}} ></i>
            <p className="font-semibold my-4 text-xl" >{name}</p>
            </h1>
            <div className="flex flex-col gap-4 "  >
                <Link onClick={()=> {setshowupdateinfo(true)}}  >Update Info </Link>
                <Link to={"/"} >Home</Link>
                <Link onClick={async ()=> {
                    localStorage.clear()
                    toast.success("Logged Out successfully")
                }} to={"/signin"} >Log Out</Link>
                <Link>Services</Link>
            </div>

        </div>
        </div>
    )
}