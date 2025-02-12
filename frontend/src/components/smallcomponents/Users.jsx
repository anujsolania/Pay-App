import axios from "axios"
import { useEffect, useState } from "react"

export function Users() {
    const [filter,setfilter] = useState("")
    const [allusers,setallusers] = useState()
    const [debounceTimeout,setdebounceTimeout] = useState("")

    async function fetchUsers() {
        const response = await axios.get("http://localhost:3000/api/v1/user/bulk")
        setallusers(response.data.allusers)
    }

    async function filterUsers(filter) {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout)
        }
        const timeoutID = setTimeout(async () => {
            const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
            setallusers(response.data.users) 
        }, 1000);

        setdebounceTimeout(timeoutID)
    }

    useEffect(() => {
        fetchUsers()
    })

    return (
        <div className="flex flex-col gap-6" style={{padding: "0 2%"}} >
            <h1 className="font-bold text-xl" >Users</h1>
            <input className="w-full border rounded" style={{padding: "0.5%"}} type="text" placeholder=" Search users..."
            value={filter} onChange={
                (e) => {
                    setfilter(e.target.value)
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
                            <button className="rounded bg-black text-white" style={{padding: "4px 10px"}}>Send Money</button>
                        </div>
                    </div>

                    </div> 
                ))) : <h1>No users found</h1>
            }
            
        </div>
    )
}