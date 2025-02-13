import { useEffect, useState } from "react";
import { Appbar } from "./smallcomponents/Appbar";
import { Balance } from "./smallcomponents/Balance";
import { Users } from "./smallcomponents/Users";
import axios from "axios";

export function Dashboard() {
    const [balance, setbalance] = useState(0);
    const [firstname, setfirstname] = useState("");
    const[lastname,setlastname] = useState("")

    async function fetchdata() {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/api/v1/account/balance",{
            headers: {
                Authorization: token
            }
        })
    setbalance(response.data.balance)
    setfirstname(response.data.firstname)
    setlastname(response.data.lastname)
    }

    useEffect(() => {
        fetchdata()
    },[])

    return (
        <div>
            <Appbar firstname={firstname} lastname={lastname} ></Appbar>
            <hr className="border-t border-gray-200" ></hr>
            <Balance balance={balance} ></Balance>
            <Users></Users>
        </div>
    )
}