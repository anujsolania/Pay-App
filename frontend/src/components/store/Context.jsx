import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const MyContext = createContext();

export function MyProvider({ children }) {
    const [balance, setbalance] = useState(0);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [receiverId, setreceiverId] = useState(""); 
    const [receiverName, setreceiverName] = useState("");

    const [allusers,setallusers] = useState()


    async function fetchData() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found!");

                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/account/balance`, {
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

    //fetch users for dashboard page
    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                console.log("No token found!");

                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/bulk`,{
                headers: {
                    Authorization: token
                }
            })
            setallusers(response.data.allusers)
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
        fetchUsers();
    }, []);

    return (
        <MyContext.Provider value={{ 
            balance, setbalance, firstname,setfirstname, lastname,setlastname,
            receiverId, setreceiverId, receiverName, setreceiverName, allusers, setallusers,
            fetchData, fetchUsers
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyProvider;