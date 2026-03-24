import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [balance, setbalance] = useState(0);
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [receiverId, setreceiverId] = useState("");
  const [receiverName, setreceiverName] = useState("");

  const [allusers, setallusers] = useState();

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");

        return null;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/account/balance`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setbalance(response.data.balance);
      setfirstname(response.data.firstname);
      setlastname(response.data.lastname);
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  const PollingforBalanceUpdate = async (oldBalance) => {
    let attempts = 0;
    const maxAttempts = 30;

    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        const currentBalance = await fetchData();
        console.log("oldBalance", oldBalance);
        console.log("Balance", currentBalance);

        if (currentBalance != oldBalance && attempts <= maxAttempts) {
          toast.success("Balance updated!");
          clearInterval(pollInterval);
        } else if (attempts >= maxAttempts) {
          console.log("MaxAttempts reached but balance never got updated");
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error while PollingforBalanceUpdate", error);
      }
    }, 2000);
  };

  //fetch users for dashboard page
  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found!");

        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/bulk`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setallusers(response.data.allusers);
      console.log(response.data.allusers);
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
    <MyContext.Provider
      value={{
        balance,
        setbalance,
        firstname,
        setfirstname,
        lastname,
        setlastname,
        receiverId,
        setreceiverId,
        receiverName,
        setreceiverName,
        allusers,
        setallusers,
        fetchData,
        fetchUsers,
        PollingforBalanceUpdate,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyProvider;
