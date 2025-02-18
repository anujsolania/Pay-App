import { useContext } from "react"
import { MyContext } from "../contextAPI/Context"

export function Balance() {
    const{balance} = useContext(MyContext)
  
    return (
        <div className="flex font-semibold text-xl" style={{margin: "4% 0", padding: "0 2%"}} >
            <h1>Your Balance ${balance}</h1>

        </div>
    )
}