import { useState } from "react"
import Navabar from "./Navbar"

export function Appbar({firstname,lastname}) {
    const[shownav,setshownav] = useState(false)

    return (
    <div style={{ padding: "2%"}}  >
        <Navabar shownav={shownav} setshownav={setshownav} ></Navabar>
        <div className="flex w-full" > 
        <div className="w-[50%] text-2xl font-extrabold" >
            <h1>Payments App</h1>
        </div>
        <div className="w-[50%] flex items-center justify-end gap-3" >
            <p>Hello, {firstname + " " + lastname}</p>
            <button className="w-8 h-8 border rounded-full"
            onClick={() => {
                setshownav(true)
            }} >{firstname.charAt(0)}</button>
        </div>
        </div> 
    </div>
    )
}