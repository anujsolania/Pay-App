import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ReceiverIdContext, ReceiverNameContext} from "../contextAPI/Context"


export function Users() {
    const [allusers,setallusers] = useState()
    const debounce = useRef()

    const [_, setReceiverId ] = useContext(ReceiverIdContext);
    const [__, setReceiverName ] = useContext(ReceiverNameContext);

    const navigate = useNavigate()

    async function fetchUsers() {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/api/v1/user/bulk",{
            headers: {
                Authorization: token
            }
        })
        setallusers(response.data.allusers)
    }

    async function filterUsers(filter) {
        if (debounce.current) {
            clearTimeout(debounce.current)
        }

        debounce.current = setTimeout(async () => {
            if (filter === "") {
                fetchUsers()
            } else {
            const token = localStorage.getItem("token")
            const response = await axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`,{
                headers: {
                    Authorization: token
                }
            })
            setallusers(response.data.users) 
            }
        }, 300);
    }

    useEffect(() => {
        fetchUsers()
    },[])

    return (
        <div className="flex flex-col gap-6" style={{padding: "0 2%"}} >
            <h1 className="font-bold text-xl" >Users</h1>
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
                            <button className="rounded bg-black text-white" style={{padding: "4px 10px"}}
                            onClick={async () => {
                                setReceiverId(user._id)
                                const name = user.firstname + " "+ user.lastname
                                setReceiverName(name)
                                navigate("/sendmoney")
                            }} >Send Money</button>
                        </div>
                    </div>

                    </div> 
                ))) : <h1>No users found</h1>
            }
            
        </div>
    )
}