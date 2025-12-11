import axios from "axios"
import { useState } from "react"
import openRazorpay from "./store/Razorpay"

const Addmoney = () => {
    const [amt, setamt] = useState("")

    const handleAddMoney = async () => {
        if (!amt || Number(amt) <= 0) {
            alert("Please enter a valid amount")
            return
        }

        const response = await axios.post(`${import.meta.env.VITE_URL}/payment/addmoney`, {
            amount: Number(amt)
        }, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })

        openRazorpay(response.data)
    }



    return (
        <div className="min-h-screen w-full bg-gray-300 flex justify-center items-center" >
            <div className="w-full bg-gray-200 max-w-md p-10 flex flex-col rounded-lg shadow-lg gap-10" >
            <div>
                <h1 className="text-2xl font-bold mb-4 text-center" >Add Money Page</h1>
            </div>
            <div className="flex flex-col gap-2" >
                <h1 className="font-semibold" >Amount (in Rs)</h1>
                <input type="text" placeholder="Enter Amount to Add" className="border rounded px-2 py-1 w-full mb-4" 
                value={amt} onChange={(e) => setamt(e.target.value)} ></input>
                <button className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600" 
                onClick={ () => {handleAddMoney}} >Proceed to Pay</button>
            </div>
            </div>
        </div>
    )
}

export default Addmoney