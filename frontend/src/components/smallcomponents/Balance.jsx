import { useContext } from "react"
import { MyContext } from "../contextAPI/Context"

export function Balance() {
    const{balance} = useContext(MyContext)
  
    return (
        <div className="flex font-semibold text-xl my-[4%] px-[2%]">
            <h1>Your Balance ₹{balance}</h1>

        </div>
    )
}