import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MyContext = createContext();

export function MyProvider({ children }) {
    const [balance, setbalance] = useState(0);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [receiverId, setreceiverId] = useState(""); 
    const [receiverName, setreceiverName] = useState("");

    async function fetchData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                return;
            }

            const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: token
                }
            });

            setbalance(response.data.balance);
            setfirstname(response.data.firstname);
            setlastname(response.data.lastname);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <MyContext.Provider value={{ 
            balance, setbalance, firstname,setfirstname, lastname,setlastname,
            receiverId, setreceiverId, receiverName, setreceiverName, fetchData
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyProvider;