import axios, { all } from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MyContext } from "../store/Context"



export function Users() {
    const{allusers,setallusers, fetchUsers} = useContext(MyContext)

    const[allTransactions,setallTransactions] = useState()
    const[showTransactions, setShowTransactions] = useState(false)

    const debounce = useRef()


    const navigate = useNavigate()


    const token = localStorage.getItem("token")


    async function filterUsers(filter) {
        if (debounce.current) {
            clearTimeout(debounce.current)
        }

        debounce.current = setTimeout(async () => {
            if (filter === "") {
                fetchUsers()
            } else {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/bulk?filter=${filter}`,{
                headers: {
                    Authorization: token
                }
            })
            setallusers(response.data.users) 
            }
        }, 300);
    }

    const getTransactions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/account/transactions`,{
                headers: {
                    Authorization: token
                }
            })
            console.log(response.data.transactions)
            setallTransactions(response.data.transactions)
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }  
    }

    useEffect(() => {
        fetchUsers()
        // getTransactions()
    },[])

    return (
        showTransactions ? (
        <div className="flex flex-col" >
            {allTransactions && allTransactions.length > 0 ? (
                allTransactions.map(txn => (
                    <div key={txn._id} className="flex justify-between border-b py-2 px-[2%]" >
                        <p>{txn.type}</p>
                        <p>{txn.amount}</p>
                    </div>
                ))) : <h1> no transactions </h1> } </div>) : (
        <div className="flex flex-col gap-6 px-[2%]">
            <div className="flex gap-12" >
                <button className="font-bold text-lg border px-3 py-1 rounded-md bg-blue-300 text-white hover:bg-blue-600" >Users</button> 
                <button className="font-bold text-lg border px-3 py-1 rounded-md bg-blue-500 text-white" 
                onClick={() => {
                    setShowTransactions(true)
                    getTransactions()
                }} >Transactions</button>
            </div>
            <input className="w-full border rounded" style={{padding: "0.5%"}} type="text" placeholder=" Search users..."
            onChange={
                (e) => {
                    const filter = e.target.value
                    filterUsers(filter)
                }
            } ></input>

            {
                allusers && allusers.length > 0 ? (
                allusers.map(user => (
                    <div key={user._id} className="flex flex-col gap-6" >
                
                    <div className="flex" >
                        <div className="w-[50%] flex items-center gap-4" >
                            <button className="w-8 h-8 border rounded-full" >{user.firstname.charAt(0)}</button>
                            <h1>{user.firstname}</h1>
                        </div>
                        <div className="w-[50%] flex justify-end" >
                            <button className="rounded bg-black text-white py-[4px] px-[10px]"
                            onClick={async () => {
                                navigate(`/sendmoney/${user._id}`)
                            }} >Send Money</button>
                        </div>
                    </div>

                    </div> 
                ))) : <h1>No users found</h1>
            }
            
        </div>)
    )
}