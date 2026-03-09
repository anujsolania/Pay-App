import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "./Users";
import { Transactions } from "./Transactions";
import { jwtDecode } from "jwt-decode";

export function UsersAnsTransactions() {
  const [allusers, setAllusers] = useState([]);

  const [allTransactions, setallTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const [transactionFilter, setTransactionFilter] = useState("all");
  const [localFilteredUsers, setLocalFilteredUsers] = useState(null);

  const [userPage, setUserPage] = useState(1);
  const [userHasMore, setUserHasMore] = useState(true);
  const userLoaderRef = useRef(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const [loading, setLoading] = useState(false); //txns
  const [userLoading, setUserLoading] = useState(false); // users

  const debounce = useRef();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin");
    return;
  }
  const decodeToken = jwtDecode(token);
  const userId = decodeToken.userId;

  const getUsers = async () => {
    if (userLoading) return;
    setUserLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/v1/user/bulk?page=${userPage}&limit=10`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const newUsers = response.data.allusers;
      setAllusers((prev) => {
        const existingIds = new Set(prev.map((u) => u._id));
        const unique = newUsers.filter((u) => !existingIds.has(u._id));
        return [...prev, ...unique];
      });
      setUserHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setUserLoading(false);
  };

  function filterUsers(filter) {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    debounce.current = setTimeout(() => {
      if (!filter) {
        setLocalFilteredUsers(null);
      } else {
        const filteredUsers = allusers.filter(
          (user) =>
            user.firstname.toLowerCase().includes(filter.toLowerCase()) ||
            user.lastname.toLowerCase().includes(filter.toLowerCase())
        );
        setLocalFilteredUsers(filteredUsers);
      }
    }, 300);
  }

  const getTransactions = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_URL
        }/api/v1/account/transactions?page=${page}&limit=5`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const newTransactions = response.data.transactions;
      setallTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t._id));
        const uniqueIds = newTransactions.filter(
          (t) => !existingIds.has(t._id)
        );
        return [...prev, ...uniqueIds];
      });
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }

    setLoading(false);
  };

  //USEROBSERVER
  useEffect(() => {
    if (showTransactions || !userHasMore || userLoading) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        setUserPage((prev) => prev + 1);
      }
    });

    if (userLoaderRef.current) {
      observer.observe(userLoaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [userHasMore, userLoading, showTransactions]);

  //TXNOBSERVER
  useEffect(() => {
    if (!hasMore || loading || !showTransactions) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, showTransactions]);

  useEffect(() => {
    getUsers();
  }, [userPage]);

  useEffect(() => {
    getTransactions();
  }, [page]);

  return (
    <div className="flex flex-col gap-6 px-[2%]">
      <div className="flex gap-12">
        <button
          className={`font-bold text-lg border px-3 py-1 rounded-md ${
            !showTransactions ? "bg-blue-600" : "bg-blue-300"
          } text-white`}
          onClick={() => {
            setShowTransactions(false);
          }}
        >
          Users
        </button>
        <button
          className={`font-bold text-lg border px-3 py-1 rounded-md ${
            showTransactions ? "bg-blue-600" : "bg-blue-300"
          } text-white`}
          onClick={() => {
            setShowTransactions(true);
          }}
        >
          Transactions
        </button>
      </div>

      {!showTransactions && (
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
      )}

      {showTransactions ? (
        <div className="flex items-center gap-6 justify-between">
          <h1 className="text-xl font-semibold">All Transactions</h1>
          {/* <option value="all">All Transactions</option> */}
          <select
            className="border rounded"
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
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

      {showTransactions ? (
        <div>
          <Transactions
            allTransactions={
              transactionFilter === "sent"
                ? allTransactions.filter(
                    (txn) =>
                      txn.type === "TRANSFER" && txn.userId._id === userId
                  )
                : transactionFilter === "received"
                ? allTransactions.filter(
                    (txn) =>
                      txn.type === "TRANSFER" && txn.receiverId?._id === userId
                  )
                : transactionFilter === "added"
                ? allTransactions.filter((txn) => txn.type === "ADD_MONEY")
                : allTransactions
            }
            userId={userId}
            loaderRef={loaderRef}
            hasMore={hasMore}
          ></Transactions>
        </div>
      ) : (
        <Users
          allusers={localFilteredUsers ?? allusers}
          navigate={navigate}
          userLoaderRef={userLoaderRef}
          hasMore={userHasMore}
          userLoading={userLoading}
        ></Users>
      )}
    </div>
  );
}
