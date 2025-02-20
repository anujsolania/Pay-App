import { useContext, useState } from "react"
import Navabar from "./Navbar"
import { MyContext } from "../contextAPI/Context"

export function Appbar() {
    const {firstname,lastname, fetchData} = useContext(MyContext)

    const[shownav,setshownav] = useState(false)

    const name = firstname + " " + lastname
    return (
    <div style={{ padding: "2%"}}  >
        <Navabar shownav={shownav} setshownav={setshownav} name={name}  ></Navabar>
        <div className="flex w-full" > 
        <div className="w-[50%] text-2xl font-extrabold" >
            <h1>Payments App</h1>
        </div>
        <div className="w-[50%] flex items-center justify-end gap-3" >
            <p>Hello, {name}</p>
            <button className="w-8 h-8 border rounded"
            onClick={() => {
                setshownav(true)
            }} ><i className="ri-menu-line"></i> </button>
        </div>
        </div> 
    </div>
    )
}