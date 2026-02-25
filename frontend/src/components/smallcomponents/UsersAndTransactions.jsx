import axios, { all } from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../store/Context";
import { Users } from "./Users";
import { Transactions } from "./Transactions";
import { jwtDecode } from "jwt-decode";

export function UsersAnsTransactions() {
  const { allusers, setallusers, fetchUsers } = useContext(MyContext);

  const [allTransactions, setallTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  // const [transactionFilter, setTransactionFilter] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const debounce = useRef();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodeToken = jwtDecode(token);
  const userId = decodeToken.userId;

  async function filterUsers(filter) {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    debounce.current = setTimeout(() => {
      if (filter === "") {
        // Reset to show all users
        fetchUsers();
      } else {
        // Filter locally - replicating backend $regex functionality
        const filteredUsers = allusers.filter(
          (user) =>
            user.firstname.toLowerCase().includes(filter.toLowerCase()) ||
            user.lastname.toLowerCase().includes(filter.toLowerCase())
        );
        setallusers(filteredUsers);
      }
    }, 300);
  }

  const getTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/account/transactions`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data);
      setallTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    console.log("1", allusers);
    fetchUsers();
    console.log("2", allusers);
    // getTransactions()
  }, []);

  return (
    <div className="flex flex-col gap-6 px-[2%]">
      <div className="flex gap-12">
        <button
          className={`font-bold text-lg border px-3 py-1 rounded-md ${
            showTransactions ? "bg-blue-600" : "bg-blue-300"
          } text-white`}
          onClick={() => {
            setShowTransactions(false);
            fetchUsers();
          }}
        >
          Users
        </button>
        <button
          className={`font-bold text-lg border px-3 py-1 rounded-md ${
            showTransactions ? "bg-blue-300" : "bg-blue-600"
          } text-white`}
          onClick={() => {
            setShowTransactions(true);
            getTransactions();
          }}
        >
          Transactions
        </button>
      </div>
      <input
        className="w-full border rounded"
        style={{ padding: "0.5%" }}
        type="text"
        placeholder=" Search users..."
        onChange={(e) => {
          const filter = e.target.value;
          filterUsers(filter);
        }}
      ></input>

      {showTransactions ? (
        <div className="flex items-center gap-6 justify-between">
          <h1 className="text-xl font-semibold">All Transactions</h1>
          {/* <option value="all">All Transactions</option> */}
          <select
            className="border rounded"
            onChange={(e) => {
              if (e.target.value === "sent") {
                const sentTxns = allTransactions.filter(
                  (txn) => txn.userId._id === userId && txn.receiverId
                );
                setFilteredTransactions(sentTxns);
              } else if (e.target.value === "received") {
                const receivedTxns = allTransactions.filter(
                  (txn) => txn.receiverId?._id === userId
                );
                setFilteredTransactions(receivedTxns);
              } else if (e.target.value === "added") {
                const addedTxns = allTransactions.filter(
                  (txn) => txn.userId._id === userId && !txn.receiverId
                );
                setFilteredTransactions(addedTxns);
              } else {
                setFilteredTransactions(allTransactions);
              }
            }}
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="added">Added to Wallet</option>
          </select>
        </div>
      ) : allusers && allusers.length > 0 ? (
        <div>
          <h1 className="text-xl font-semibold">All Users</h1>
        </div>
      ) : null}

      {showTransactions && filteredTransactions ? (
        <div>
          <Transactions
            allTransactions={filteredTransactions}
            userId={userId}
          ></Transactions>
        </div>
      ) : (
        <Users allusers={allusers} navigate={navigate}></Users>
      )}
    </div>
  );
}
