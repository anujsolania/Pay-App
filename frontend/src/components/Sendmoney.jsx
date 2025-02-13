import axios from "axios";
import { useContext, useState } from "react"
import { ReceiverIdContext, ReceiverNameContext } from "./contextAPI/Context";
import { useNavigate } from "react-router-dom";

export function Sendmoney() {
    const[amount,setamount] = useState("")
    

    const [receiverId] = useContext(ReceiverIdContext)
    const [receiverName] = useContext(ReceiverNameContext)

    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-200" >
            <div className="rounded flex flex-col gap-15 bg-white" style={{padding: "3% 5%"}} >
                <p className="text-center text-2xl font-bold" >Send Money</p>


                <div>

                <div className="flex gap-2" >
                <button className="h-8 w-8 bg-green-500 rounded-full text-white" >{receiverName.charAt(0)}</button>
                <h1 className="font-semibold" >{receiverName}</h1>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                    <p className="text-sm font-semibold" >Amount (in Rs)</p>
                    <input className="border rounded w-full " type="text" placeholder=" Enter amount"
                    value={amount} onChange={(e) => {
                        setamount(e.target.value)
                    }} ></input>
                    </div>
                    <button className="border-2 border-green-500 rounded bg-green-500 text-white text-sm" style={{padding: "3px 4px"}} 
                    onClick={async () => {
                        const token = localStorage.getItem("token")
                        const response = await axios.patch("http://localhost:3000/api/v1/account/transfer",{
                            receiverId,
                            amount
                        },{
                            headers: {
                                Authorization: token
                            }
                        })
                        alert(response.data.mssg)
                        navigate("/dashboard")
                    }} >Initiate Transfer</button>
                </div>

                </div>
            </div>
        </div>
    )
}