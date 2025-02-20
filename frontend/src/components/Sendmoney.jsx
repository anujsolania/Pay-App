import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { MyContext} from "./contextAPI/Context";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function Sendmoney() {
    const[amount,setamount] = useState("")

    const{fetchData} = useContext(MyContext)

    const {receiverName,setreceiverName} = useContext(MyContext)

    const navigate = useNavigate()

    const { rId } = useParams()
    console.log

    async function fetchReceiverDetails() {

        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/account/receiverdetails/${rId}`,{
            headers: {
                Authorization: token
            }
        })
        setreceiverName(response.data.name)

    }

    useEffect(() => {
        fetchReceiverDetails()
    },[])

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-gray-200" >
            <div className="rounded flex flex-col gap-15 bg-white py-[3%] px-[5%]" >
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
                    <Link className="border-2 border-green-500 rounded bg-green-500 text-white text-sm text-center py-[3px] px-[4px]" 
                    onClick={async () => {
                        const token = localStorage.getItem("token")
                        const response = await axios.patch(`${import.meta.env.VITE_URL}/api/v1/account/transfer`,{
                            rId,
                            amount
                        },{
                            headers: {
                                Authorization: token
                            }
                        })
                        toast.success(response.data.mssg)
                        fetchData()
                        navigate("/dashboard")
                    }} >Initiate Transfer</Link>
                </div>

                </div>
            </div>
        </div>
    )
}